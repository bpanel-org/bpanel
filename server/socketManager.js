const { Server } = require('bweb');
const assert = require('bsert');
const { sha256, random, ccmp } = require('bcrypto');
const { base58 } = require('bstring');
const { URL } = require('url');
const Validator = require('bval');

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
    this.types = ['node', 'wallet'];
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
  }

  /*
   * handle new socket clients that connect to server
   * @param {WebSocket} socket
   * @returns {null}
   */
  handleSocket(socket) {
    socket.hook('auth', (...args) => {
      if (socket.channel('auth')) throw new Error('Already authed.');

      if (!this.options.noAuth) {
        const valid = new Validator(args);
        const key = valid.str(0, '');
        if (key.length > 255) throw new Error('Invalid API key.');

        const data = Buffer.from(key, 'utf8');
        const hash = sha256.digest(data);

        if (!ccmp(hash, this.options.apiHash))
          throw new Error('Invalid API key.');
      }

      socket.join('auth');
      this.logger.info('Successful auth from %s.', socket.host);
      this.handleAuth(socket);
      return null;
    });
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
    if (!this.clients.has(id))
      this.logger.warning(
        `getIdFromPath: id ${id} from pathname ${pathname} does not exist`
      );

    return id;
  }

  /*
   * Handle new auth'd websocket.
   * @private
   * @param {WebSocket} socket
   */
  handleAuth(socket) {
    const parseEvent = event => {
      assert(typeof event === 'string', 'Must pass a string to getClient');
      // defaulting to node client if there is no client prefix
      let parsedEvent = event;
      let id = 'node';

      // check if first full word is a valid type
      const split = event.indexOf(' ');
      const prefix = event.slice(0, split);
      if (this.types.indexOf(prefix) !== -1) {
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
      const [clientId, event] = parseEvent(_event);
      const client = this.clients.get(id)[clientId];
      this.logger.info(`broadcast "${event}"" to ${id}'s ${clientId} client`);
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

      // TODO: support other this.types
      const [clientId, event] = parseEvent(_event);
      const client = this.clients.get(id)[clientId];
      const channel = `${clientId}-${id}:${event}-${responseEvent}`;
      this.logger.info(
        `Subscribing ${id}'s ${clientId} socket event "${event}"`
      );

      // if the channel doesn't exist we should bind
      // the client to listen for the event
      // only needs to bound once no matter how many clients
      // have the same subscription
      this.join(socket, channel);
      const sockets = this.channel(channel);
      client.bind(event, (...data) => {
        this.logger.info(`"${id}" client received "${event}"`);
        this.logger.info(`sending "${responseEvent}" to channel "${channel}"`);
        // send responseEvent to the channel
        this.to(channel, responseEvent, ...data);
      });

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
      const [clientId, event] = parseEvent(_event);
      const channel = `${clientId}-${id}:${event}-${responseEvent}`;
      this.logger.info(
        `Unsubscribing from ${id}'s ${clientId} socket event "${event}"`
      );
      if (!this.channel(channel)) {
        this.logger.warning('channel did not exist', channel);
        return;
      }

      this.leave(socket, channel);
    });

    // requests from client for messages to be dispatched to node
    // dispatches expect bsock calls which wait for acknowledgement response
    socket.hook('dispatch', async (_event, ...args) => {
      assert(
        this.clients.has(id),
        `No client ${id} for request from ${socket.url}`
      );
      const [clientId, event] = parseEvent(_event);
      const client = this.clients.get(id)[clientId];
      this.logger.info(`dispatch "${event}" to ${id} ${clientId} client`);
      const resp = await client.call(event, ...args);
      return resp;
    });
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

    if (this.clients.has(id))
      throw new Error(`Clients with id ${id} already exists`);

    for (let client in clients) {
      await clients[client].open();
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
      this.logger.debug(`No clients with id ${id} exists in manager`);
      return;
    }

    const clients = this.clients.get(id);
    for (let client in clients) {
      await clients[client].close();
    }

    this.clients.delete(id);
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
    this.apiHash = sha256.digest(Buffer.from(this.apiKey, 'ascii'));
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
      this.apiHash = sha256.digest(Buffer.from(this.apiKey, 'ascii'));
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
      if (this.host === '127.0.0.1' || this.host === '::1') this.noAuth = true;
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

module.exports = SocketManager;
