const { Server } = require('bweb');
const assert = require('bsert');
const { SHA256, random, safeEqual } = require('bcrypto');
const { base58 } = require('bstring');
const { URL } = require('url');
const Validator = require('bval');
const net = require('net');
const IP = require('binet');

class SocketManager extends Server {
  /**
   * Create an http server.
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    super(new SocketManagerOptions(options));

    this.logger =
      this.options.logger && this.options.logger.context('socket-manager');
    this.clients = new Map();
    this.sockets = new WeakMap();
    this.ports = new Set();
    this.subscriptions = new Map();
    this.types = ['node', 'wallet'];

    if (options.ports) {
      for (const port of options.ports) this.ports.add(port);
    }

    this.init();
  }

  /*
   * Initialize server
   */
  init() {
    this.on('request', req => {
      if (req.method === 'POST' && req.pathname === '/') return;

      this.logger.debug(
        'Request for method=%s path=%s (%s).',
        req.method,
        req.pathname,
        req.socket.remoteAddress
      );
    });

    this.on('listening', address => {
      this.logger.info(
        'SocketManager server listening on %s (port=%d).',
        address.address,
        address.port
      );
    });

    this.on('add client', async (id, clients) => {
      this.logger.info('adding client %s', id);
      await this.addClients(id, clients);
    });
  }

  /*
   * handle new socket clients that connect to server
   * @param {WebSocket} socket
   * @returns {null}
   */
  handleSocket(socket) {
    socket.hook('auth', (...args) => {
      if (socket.channel('auth')) {
        this.logger.warning('Already authed');
        return;
      }

      const state = new SocketState(this, socket);

      // Use a weak map to avoid
      // mutating the websocket object.
      this.sockets.set(socket, state);

      socket.on('error', err => {
        this.emit('error', err);
      });

      if (!this.options.noAuth) {
        const valid = new Validator(args);
        const key = valid.str(0, '');
        if (key.length > 255) throw new Error('Invalid API key.');

        const data = Buffer.from(key, 'utf8');
        const hash = SHA256.digest(data);

        if (!safeEqual(hash, this.options.apiHash))
          throw new Error('Invalid API key.');
      }

      socket.join('auth');
      this.logger.info('Successful auth from %s.', socket.host);
      this.handleAuth(socket);
      return null;
    });
  }

  /*
   * Handle new auth'd websocket.
   * @private
   * @param {WebSocket} socket
   */
  handleAuth(socket) {
    this.logger.info('Preparing socket from %s', socket.url);
    const parseEvent = event => {
      assert(typeof event === 'string', 'Must pass a string to getClient');
      // defaulting to node client if there is no client prefix
      let parsedEvent = event;
      let id = 'node';

      // check if first full word is a valid type
      const split = event.indexOf(' ');
      const prefix = event.slice(0, split);
      if (this.types.includes(prefix)) {
        id = prefix;
        parsedEvent = event.slice(split + 1);
      }
      return [id, parsedEvent];
    };

    // pathname will be used similar to socket.io's namespaces
    // they should correspond to the client id that will be used
    // to make the calls
    const { pathname } = new URL(socket.ws.url);
    const id = this.getIdFromPath(pathname);
    // broadcasts only send messages to the  node
    // but originating socket does not expect a response
    /**
      // Example broadcast from client:
      socket.fire('broadcast', 'set filter', '00000000000000000000');
      // which will result in the following fire to bcoin server
      nodeClient.socket.fire('set filter', '00000000000000000000');
    **/
    socket.bind('broadcast', (_event, ...args) => {
      assert(
        this.clients.has(id),
        `No client ${id} for request from ${socket.url}`
      );
      const [clientType, event] = parseEvent(_event);
      const client = this.clients.get(id)[clientType];
      if (!client)
        this.logger.info('No %s client found under the id %s', clientType, id);
      this.logger.info(
        `broadcast "%s" to %s's %s client`,
        event,
        id,
        clientType
      );
      client.call(event, ...args);
    });

    // requests from client to subscribe to events from node
    // client should indicate the event to listen for
    // and the `responseEvent` to fire when the event is heard
    socket.bind('subscribe', async (_event, responseEvent) => {
      assert(
        this.clients.has(id),
        `No client ${id} for request from ${socket.url}`
      );
      assert(responseEvent, 'subscribe event requires a responseEvent.');

      const [clientType, event] = parseEvent(_event);
      const client = this.clients.get(id)[clientType];
      if (!client)
        this.logger.debug('No client %s found under the id %s', clientType, id);
      const channel = this.getChannelName(clientType, id, event, responseEvent);
      this.logger.info(
        `Subscribing to %s's %s socket event "%s"`,
        id,
        clientType,
        event
      );

      // add socket to this channel so we can send events to it
      this.join(socket, channel);

      // keep track of the channels the socket has joined
      socket.join(channel);

      // if did not have this subscription yet
      // then we need to bind the client to listen for the event
      // only needs to be bound once no matter how many clients
      // have the same subscription
      // Channel names are unique to client type, id, event, and responseEvent
      // so new subscription is created if any of these change
      if (!this.subscriptions.has(channel)) {
        // create the handler that will be bound to the client
        const handler = (...data) => {
          this.logger.info('"%s" client received "%s"', id, event);
          this.logger.info(
            'Sending "%s" to channel "%s"',
            responseEvent,
            channel
          );
          // send responseEvent to the channel
          this.to(channel, responseEvent, ...data);
        };

        // save subscription handler
        // need this later to _unbind_ the handler
        // when all sockets have disconnected/unsubscribed
        this.subscriptions.set(channel, handler);

        // subscribe to event
        client.bind(event, handler);
      }
      return null;
    });

    socket.bind('unsubscribe', async (_event, responseEvent) => {
      assert(
        this.clients.has(id),
        `No client ${id} for request from ${socket.url}`
      );
      assert(
        responseEvent,
        'Must pass original responseEvent arg to unsubscribe'
      );
      const [clientType, event] = parseEvent(_event);
      const channel = this.getChannelName(clientType, id, event, responseEvent);
      this.logger.info(
        `Unsubscribing from ${id}'s ${clientType} socket event "${event}"`
      );
      if (!this.channel(channel)) {
        this.logger.warning('Channel did not exist', channel);
        return;
      }
      this.handleUnsubscribe(socket, channel);
    });

    // requests from client for messages to be dispatched to node
    // dispatches expect bsock calls which wait for acknowledgement response
    socket.hook('dispatch', async (_event, ...args) => {
      assert(
        this.clients.has(id),
        `No client ${id} for request from ${socket.url}`
      );
      const [clientType, event] = parseEvent(_event);
      const client = this.clients.get(id)[clientType];
      this.logger.info('Dispatch "%s" to %s %s client', event, id, clientType);
      const resp = await client.call(event, ...args);
      return resp;
    });

    // listener for tcp proxy requests (useful for in-browser nodes)
    socket.bind('tcp connect', (port, host) => {
      this.handleTCPConnect(socket, port, host);
    });

    // handle disconnect
    socket.on('disconnect', () => {
      this.logger.info('Disconnecting socket from %s', socket.url);

      // need to unsubscribe from all channel subscriptions
      const channels = socket.channels;
      channels.forEach(channel => {
        this.handleUnsubscribe(socket, channel);
      });
    });
  }

  parseSubscriptionChannel(channel) {
    const [client, _event] = channel.split(':');
    if (_event) {
      const [event, responseEvent] = _event.split('-');
      const [clientType, id] = client.split('-');
      return { event, responseEvent, clientType, id };
    }
    // not a subscription channel otherwise
    return null;
  }

  handleUnsubscribe(socket, channel) {
    this.logger.info(
      'Unsubscribing %s from "%s" channel',
      socket.host,
      channel
    );

    // remove the socket from the channel
    this.leave(socket, channel);

    // parse channel name for client info
    const parsed = this.parseSubscriptionChannel(channel);

    // nothing left to do if not an event subscription channel
    if (!parsed) return;

    const { event, clientType, id } = parsed;

    // if the channel for this subscription is empty,
    // then we should unbind the client and remove subscription
    if (!this.channel(channel)) {
      this.logger.info(
        '"%s" has no more subscriptions, removing handlers',
        channel
      );
      const client = this.clients.get(id)[clientType];
      const handler = this.subscriptions.get(channel);

      // unbind handler
      client.socket.unbind(event, handler);

      // remove channel's handler from subscriptions
      this.subscriptions.delete(channel);
    }
  }

  handleTCPConnect(ws, port, host) {
    const state = this.sockets.get(ws);
    assert(state);
    if (state.socket) {
      this.proxyLog('info', 'Client is trying to reconnect (%s).', state.host);
      return;
    }

    if (
      (port & 0xffff) !== port ||
      typeof host !== 'string' ||
      host.length === 0
    ) {
      this.proxyLog('error', 'Client gave bad arguments (%s).', state.host);
      ws.fire('tcp close');
      ws.destroy();
      return;
    }

    let raw, addr;
    try {
      raw = IP.toBuffer(host);
      addr = IP.toString(raw);
    } catch (e) {
      this.proxyLog(
        'error',
        'Client gave a bad host: %s (%s).',
        host,
        state.host
      );
      ws.fire('tcp error', {
        message: 'EHOSTUNREACH',
        code: 'EHOSTUNREACH'
      });
      ws.destroy();
      return;
    }

    if (!IP.isRoutable(raw) || IP.isOnion(raw)) {
      this.proxyLog(
        'warning',
        'Client is trying to connect to a bad ip: %s (%s).',
        addr,
        state.host
      );
      ws.fire('tcp error', {
        message: 'ENETUNREACH',
        code: 'ENETUNREACH'
      });
      ws.destroy();
      return;
    }

    if (!this.ports.has(port)) {
      this.proxyLog(
        'warning',
        'Client is connecting to non-whitelist port (%s).',
        state.host
      );
      ws.fire('tcp error', {
        message: 'ENETUNREACH',
        code: 'ENETUNREACH'
      });
      ws.destroy();
      return;
    }

    let socket;
    try {
      socket = state.connect(port, addr);
      this.proxyLog(
        'info',
        'Connecting to %s (%s).',
        state.remoteHost,
        state.host
      );
    } catch (e) {
      this.proxyLog('error', e.message);
      this.proxyLog('info', 'Closing %s (%s).', state.remoteHost, state.host);
      ws.fire('tcp error', {
        message: 'ENETUNREACH',
        code: 'ENETUNREACH'
      });
      ws.destroy();
      return;
    }

    socket.on('connect', () => {
      ws.fire('tcp connect', socket.remoteAddress, socket.remotePort);
    });

    socket.on('data', data => {
      ws.fire('tcp data', data.toString('hex'));
    });

    socket.on('error', err => {
      ws.fire('tcp error', {
        message: err.message,
        code: err.code || null
      });
    });

    socket.on('timeout', () => {
      ws.fire('tcp timeout');
    });

    socket.on('close', () => {
      this.proxyLog('info', 'Closing %s (%s).', state.remoteHost, state.host);
      ws.fire('tcp close');
      ws.destroy();
    });

    ws.bind('tcp data', data => {
      if (typeof data !== 'string') return;
      socket.write(Buffer.from(data, 'hex'));
    });

    ws.bind('tcp keep alive', (enable, delay) => {
      socket.setKeepAlive(enable, delay);
    });

    ws.bind('tcp no delay', enable => {
      socket.setNoDelay(enable);
    });

    ws.bind('tcp set timeout', timeout => {
      socket.setTimeout(timeout);
    });

    ws.bind('tcp pause', () => {
      socket.pause();
    });

    ws.bind('tcp resume', () => {
      socket.resume();
    });

    ws.on('disconnect', () => {
      socket.destroy();
    });
  }

  proxyLog(level, _message, ...args) {
    const message = `(wsproxy) ${_message}`;
    this.logger[level](message, ...args);
  }

  /*
   * Utility to verify that the pathname
   * matches with the id of a client on the class
   * @private
   * @param {string} pathname - pathname to validate
   * @returns {string} id
   */
  getIdFromPath(pathname) {
    assert(
      pathname[0] === '/' && pathname[pathname.length - 1] === '/',
      'Invalid pathname'
    );
    const id = pathname.slice(1, pathname.length - 1);
    if (!this.clients.has(id) && id !== 'socket.io')
      this.logger.warning(
        'getIdFromPath: id %s from pathname %s does not exist',
        id,
        pathname
      );

    return id;
  }

  /* Create properly formatted channel name
   * creating a unique channel name for subscriptions
   * each channel needs to be unique to the clientType
   * (one of accepted types, e.g. wallet or node),
   * the id of socket (i.e. from the socket's path)
   * event being subscribed to and the event fired when event
   * is heard.
   * @param {string} clientType
   * @param {string} id
   * @param {string} event
   * @param {responseEvent}
   * @returns {string} channelName
   */
  getChannelName(clientType, id, event, responseEvent) {
    assert(
      typeof clientType === 'string',
      'required string clientType for channel name'
    );
    assert(typeof id === 'string', 'required string id for channel name');
    assert(typeof event === 'string', 'required string event for channel name');
    assert(
      typeof responseEvent === 'string',
      'required string responseEvent for channel name'
    );
    return `${clientType}-${id}:${event}-${responseEvent}`;
  }

  /*
   * add clients object to map of manager's clients
   * @param {string} id - id to store clients under
   * @param {Object} clients
   * @param {NodeClient} [clients.node]
   * @param {WalletClient} [clients.wallet]
   * @param {MultisigClient} [clients.multisig]
   * @returns {void}
   */
  async addClients(id, clients) {
    assert(typeof id === 'string', 'Must pass an id and must be a string');

    if (this.clients.has(id)) return;

    // TODO: determine if we want to close the
    // clients or constantly have them try to connect
    for (const client of Object.values(clients)) {
      client.open();
      let errorCount = 0;
      client.on('error', async error => {
        this.logger.error(
          'client %s error %s: %s',
          id,
          ++errorCount,
          error.message
        );
        if (errorCount === 3) await client.close();
      });
    }

    this.clients.set(id, clients);
  }

  /*
   * Remove clients of the given id from manager
   * @param {string} id - id of clients to remove
   * @returns {void}
   */
  async removeClients(id) {
    assert(typeof id === 'string', 'Must pass an id and must be a string');

    if (!this.clients.has(id)) {
      this.logger.debug('No clients with id %s exists in manager', id);
      return;
    }

    const clients = this.clients.get(id);
    for (let client in clients) {
      await clients[client].close();
    }

    this.clients.delete(id);
  }

  hasClient(id) {
    return this.clients.has(id);
  }
}

class SocketManagerOptions {
  /**
   * SocketManagerOptions
   * @alias module:http.SocketManagerOptions
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    this.logger = null;
    this.apiKey = base58.encode(random.randomBytes(20));
    this.apiHash = SHA256.digest(Buffer.from(this.apiKey, 'ascii'));
    this.noAuth = false;
    this.port = 8000;

    this.fromOptions(options);
  }

  /**
   * Inject properties from object.
   * @private
   * @param {Object} options
   * @returns {SocketManagerOptions}
   */

  fromOptions(options) {
    assert(options, 'Must pass options object');

    if (options.logger != null) {
      assert(typeof options.logger === 'object');
      this.logger = options.logger;
    }

    if (options.apiKey != null) {
      assert(typeof options.apiKey === 'string', 'API key must be a string.');
      assert(options.apiKey.length <= 255, 'API key must be under 256 bytes.');
      this.apiKey = options.apiKey;
      this.apiHash = SHA256.digest(Buffer.from(this.apiKey, 'ascii'));
    }

    if (options.noAuth != null) {
      assert(typeof options.noAuth === 'boolean');
      this.noAuth = options.noAuth;
    }

    if (options.host != null) {
      assert(typeof options.host === 'string');
      this.host = options.host;
    }

    if (options.port != null) {
      assert(
        (options.port & 0xffff) === options.port,
        'Port must be a number.'
      );
      this.port = options.port;
    }

    // Allow no-auth implicitly
    // if we're listening locally.
    if (!options.apiKey) {
      if (this.host === '127.0.0.1' || this.host === '::1') {
        if (this.logger)
          this.logger.info(
            'no apiKey passed and listening locally, allow no-auth implicitly'
          );
        this.noAuth = true;
      }
    }
    return this;
  }

  /**
   * Instantiate http options from object.
   * @param {Object} options
   * @returns {SocketManagerOptions}
   */

  static fromOptions(options) {
    return new SocketManagerOptions().fromOptions(options);
  }
}

class SocketState {
  constructor(server, socket) {
    this.socket = null;
    this.host = socket.host;
    this.remoteHost = null;
  }

  connect(port, host) {
    this.socket = net.connect(port, host);
    this.remoteHost = IP.toHostname(host, port);
    return this.socket;
  }
}

module.exports = SocketManager;
