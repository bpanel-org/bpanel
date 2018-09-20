const { assert } = require('chai');
const { Server } = require('bweb');
const blgr = require('blgr');
const bsock = require('bsock');
const { NodeClient, WalletClient } = require('bclient');
const SocketManager = require('../socketManager');
const { initFullNode, initWallet } = require('./utils/regtest');

const ports = {
  full: {
    p2p: 49331,
    node: 49332,
    wallet: 49333
  },
  spv: {
    p2p: 49431,
    node: 49432,
    wallet: 49433
  },
  manager: 1234
};

const serverApiKey = 'foo';

describe('socketManager', function() {
  let socketManager,
    logger,
    options,
    apiKey,
    client,
    supportedTypes,
    node,
    nclient,
    wclient,
    mineBlocks;

  before(
    'setup bcoin node, chain, client, and SocketManager',
    async function() {
      this.timeout(3000);
      supportedTypes = ['node', 'wallet'];
      try {
        logger = new blgr({
          level: 'info'
        });
        await logger.open();
        node = await initFullNode({
          ports,
          memory: true,
          logLevel: 'none',
          apiKey: serverApiKey
        });
        nclient = new NodeClient({
          port: ports.full.node,
          apiKey: serverApiKey
        });
        wclient = new WalletClient({
          port: ports.full.wallet,
          apiKey: serverApiKey
        });

        // setting up the chain by mining some blocks
        await initWallet(wclient);
        await wclient.execute('selectwallet', ['test']);
        const coinbase = await wclient.execute('getnewaddress', ['blue']);
        const blockCount = 10;

        // make a function so other tests can use this
        mineBlocks = n => nclient.execute('generatetoaddress', [n, coinbase]);
        const result = await mineBlocks(blockCount);
        assert(
          result && result.length === blockCount,
          `Chain not initiated properly`
        );

        // setup manager
        apiKey = 'foobar';
        options = {
          apiKey,
          port: ports.manager,
          logger
        };
        socketManager = new SocketManager(options);

        await socketManager.open();
        socketManager.on('error', () => {});

        // testing client
        client = bsock.connect(ports.manager);
        client.on('error', function(e) {
          // eslint-disable-next-line no-console
          console.error('Problem with client socket: ', e.message);
          client.destroy();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Problem during setup: ', e);
      }
    }
  );

  after('close node and SocketManager', async function() {
    await logger.close();
    await node.close();
    if (nclient.opened) await nclient.close();
    if (wclient.opened) await wclient.close();
    if (client.connected) await client.destroy();
    await socketManager.close();
  });

  describe('initialization', function() {
    it('should initialize a SocketManager with the right options', function() {
      assert(socketManager.logger, 'Did not set a logger');
      assert.instanceOf(
        socketManager,
        Server,
        'SocketManager should be an instance of a bweb Server'
      );
      assert(socketManager.clients, 'Did not initialize with clients');
      assert(socketManager.io.channels, 'Did not initialize with channels');
      assert(
        Array.isArray(socketManager.types),
        'Did not initialize with array of supported types'
      );
      for (let type of supportedTypes) {
        assert(
          socketManager.types.indexOf(type) > -1,
          `${type} not found in socketManager.types`
        );
      }
      assert.lengthOf(
        socketManager.types,
        supportedTypes.length,
        `should have ${supportedTypes.length} types`
      );
    });

    it('should initialize a socket server', function(done) {
      let socket;
      try {
        socket = bsock.connect(ports.manager);
        socket.on('connect', async function() {
          // if we reach this done then the test has passed
          await socket.destroy();
          done();
        });

        socket.on('error', e => {
          done(new Error(`Could not connect to socket server ${e.message}`));
        });
      } catch (e) {
        done(new Error(`There was an error connecting to the socket: ${e}`));
      }
    });

    it('should handle auth', async function() {
      assert(
        !socketManager.noAuth,
        'noAuth should be set to false in the test'
      );

      const sockets = socketManager.io.sockets.values();
      for (let socket of sockets) {
        assert(!socket.channel('auth'), 'Expected no authenticated sockets');
      }

      const authSocket = () => client.call('auth', apiKey);

      const resp = await authSocket();
      assert.isNull(
        resp,
        'Expected a null response on successful authentication'
      );

      try {
        await authSocket();
        throw 'Expected second authentication to throw an error';
      } catch (e) {
        assert(e instanceof Error, e);
        assert(
          e.message.match(/Already authed/),
          'Should include "Already authed" error message'
        );
      }
    });
  });

  describe('addClients, removeClients, getIdFromPath', function() {
    let clients, id, pathname;
    beforeEach('add clients to socketManager', async function() {
      if (wclient.opened) await wclient.close();
      if (nclient.opened) await nclient.close();
      clients = {
        wallet: wclient,
        node: nclient
      };
      id = 'test123';
      pathname = `/${id}/`;
      await socketManager.addClients(id, clients);
    });

    afterEach('cleanup socketManager clients', async function() {
      if (socketManager.clients.has(id)) await socketManager.removeClients(id);
    });

    it('should be able to add new clients keyed to id and type', function() {
      assert(
        socketManager.clients.has(id),
        `Could not find clients under the id ${id}`
      );
      const managerClients = socketManager.clients.get(id);
      assert.instanceOf(
        managerClients['wallet'],
        WalletClient,
        'Expected a wallet client'
      );
      assert.instanceOf(
        managerClients['node'],
        NodeClient,
        'Expected a node client'
      );
    });

    it('should not allow duplicate clients', async function() {
      try {
        await socketManager.addClients(id, clients);
        assert(false, 'Expected addClients to throw on duplicate');
      } catch (e) {
        assert.instanceOf(
          e,
          Error,
          'Expected an error to be thrown on duplicate'
        );
        assert(e.message.match(/already exists/), e.message);
      }
    });

    it('should be able to remove all clients for a given id', async function() {
      assert(
        socketManager.clients.has(id),
        'Could not find client id to be removed'
      );
      await socketManager.removeClients(id);
      assert(
        !socketManager.clients.has(id),
        `${id} clients were not removed from manager`
      );
    });

    describe('getIdFromPath', () => {
      it('should return an id for a path that matches the id of a client', () => {
        const idFromPath = socketManager.getIdFromPath(pathname);
        assert(idFromPath === id, 'Did not correctly validate the pathname');
      });

      it('should throw for invalid paths', () => {
        const getId = () => socketManager.getIdFromPath(id);
        assert.throws(getId, Error, /\binvalid\b|\bdoes not exist\b/i);
      });
    });
  });

  describe('socket message handlers', function() {
    let id, event, socket;

    beforeEach('setup client and some handlers', async function() {
      id = 'socket.io';
      event = 'watch chain';

      // adding default node and wallet client for testing handlers
      if (nclient.opened) await nclient.close();
      if (wclient.opened) await wclient.close();
      await socketManager.addClients(id, { node: nclient, wallet: wclient });
      socket = bsock.connect(ports.manager);
      socket.on('error', e => {
        throw e;
      });
      await socket.call('auth', apiKey);
    });

    afterEach('cleanup sockets and clients', async function() {
      await socketManager.removeClients(id);
      if (socket.connected) await socket.destroy();
    });

    it('should send dispatch messages to the correct servers', async function() {
      // first confirming integrity of the test
      const needle = 'chain';
      assert.include(event, needle, `The event should contain `);
      assert(
        !node.http.channel('chain'),
        'Should not have chain channel before broadcast has been sent'
      );
      await socket.call('broadcast', event);
      assert(
        node.http.channel('chain'),
        `Node server doesn't have a channel for chain`
      );
    });

    // TODO: add tests to confirm wallet and multisig clients also
    // get their subscriptions, etc.
    it('should create new channels for new subscriptions', async function() {
      const eventName = 'test event';
      const responseEvent = 'heard event';
      const subscription = `${eventName}:${responseEvent}`;

      assert(
        !socketManager.channel(subscription),
        'manager should not have event subscription before the first subscribe event is called'
      );

      // confirm new channel was created for subscription
      await socket.call('subscribe', eventName, responseEvent);
      assert(
        socketManager.channel(subscription),
        `socketManager did not have subscription for ${subscription}`
      );
    });

    xit('should fire response events to sockets w/ corresponding subscriptions', async function(done) {
      try {
        // note we already dispatched `watch chain` so just need to subscribe to block connect
        const eventName = 'block connect';
        const responseEvent = 'heard event';

        await socket.fire('subscribe', eventName, responseEvent);
        socket.on(responseEvent, function() {
          // if we hit done then we know it was successful. no need for an assertion
          done();
        });

        // when a block is mined we expect the block connect event to be fired
        await mineBlocks(1);
      } catch (e) {
        done(
          new Error(`Trouble receiving responseEvents for subscriptions: ${e}`)
        );
      }
    });

    xit('should remove sockets from channels when disconnected', async function() {
      const eventName = 'test remove';
      const responseEvent = 'foo bar';
      const subscription = `${eventName}:${responseEvent}`;

      socket.fire('subscribe', eventName, responseEvent);
      assert(
        socketManager.channel(subscription),
        `socketManager did not have subscription for ${subscription}`
      );

      await socket.close();
      assert(
        !socketManager.io.has(socket),
        'SocketManager should not have socket client after close'
      );
      assert(
        !socketManager.channel(subscription),
        'Subscription channel should be removed after socket closing'
      );
    });
  });
});
