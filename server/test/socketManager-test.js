const { assert } = require('chai');
const { Server } = require('bweb');
const blgr = require('blgr');
const bsock = require('bsock');
const { NodeClient, WalletClient } = require('bclient');
const SocketManager = require('../socketManager');
const { initFullNode, initWallet } = require('./utils/regtest');
const { sleep } = require('./utils/helpers');

const ports = {
  full: {
    p2p: 49331,
    node: 49332,
    wallet: 49333
  },
  node2: {
    p2p: 49431,
    node: 49432,
    wallet: 49433
  },
  manager: 1234
};

const serverApiKey = 'foo';
const walletId = 'blue';
async function setupWallet(client) {
  await initWallet(client);
  await client.execute('selectwallet', ['test']);
  return await client.execute('getnewaddress', [walletId]);
}

describe.only('socketManager', function() {
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
          level: 'none'
        });
        await logger.open();
        node = await initFullNode({
          ports: ports.full,
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
        const coinbase = await setupWallet(wclient);
        // make a function so other tests can use this
        const blockCount = 10;
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
    let id, event, socket, responseEvent, subscribeEvent;

    async function broadcastTest(needle, event, node, socket) {
      // first confirming integrity of the test
      assert.include(event, needle, `The event should contain ${needle}`);
      assert(
        !node.http.channel(needle),
        `Should not have ${needle} channel before broadcast has been sent`
      );
      socket.fire('broadcast', event);
      await sleep(200);
      assert(
        node.http.channel(needle),
        `Node server doesn't have a channel for ${needle}`
      );
    }

    beforeEach('setup client and some handlers', async function() {
      id = 'socket.io';
      event = 'watch chain';
      subscribeEvent = 'block connect';
      responseEvent = 'heard event';

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

    it('should send broadcast messages to the correct servers', async function() {
      await broadcastTest('chain', event, node, socket);
    });

    it('should be able able to interact with other client types, like wallet', async function() {
      const wdb = node.plugins.walletdb;
      let sockets = wdb.http.io.sockets.values();
      for (const sock of sockets) {
        assert(
          !sock.channel(`w:${walletId}`),
          `Socket should not already be subscribed to wallet "${walletId}"`
        );
      }
      await socket.call('dispatch', 'wallet join', walletId);
      let joined = false;
      sockets = wdb.http.io.sockets.values();
      for (const sock of sockets) {
        if (sock.channel(`w:${walletId}`)) joined = true;
      }
      await socket.call('dispatch', 'wallet leave', walletId);
      assert(joined, `Socket did not successfully dispatch join to wallet`);
    });

    it('should create new channels for new subscriptions', async function() {
      const eventName = 'test event';
      const responseEvent = 'heard event';
      const subscription = socketManager.getChannelName(
        'node',
        id,
        eventName,
        responseEvent
      );

      assert(
        !socketManager.channel(subscription),
        'manager should not have event subscription before the first subscribe event is called'
      );

      // confirm new channel was created for subscription
      socket.fire('subscribe', eventName, responseEvent);
      await sleep(300);
      assert(
        socketManager.channel(subscription),
        `socketManager did not have subscription for ${subscription}`
      );
    });

    it('should fire response events to sockets w/ corresponding subscriptions', async function() {
      let received = false;
      // first watch the chain
      socket.fire('subscribe', subscribeEvent, responseEvent);
      await sleep(300);

      socket.bind(responseEvent, function(...data) {
        assert(data, 'No data received from block connect event');
        received = true;
      });

      // when a block is mined we expect the block connect event to be fired
      await mineBlocks(1);
      await sleep(500);
      assert(received, `Never received a responseEvent ${responseEvent}`);
    });

    it('should wait for responses from dispatches', async function() {
      try {
        const needle = 'chain';
        // similar to broadcast test except we're expecting a response
        assert.include(event, needle, `The event should contain ${needle}`);
        assert(
          !node.http.channel(needle),
          `Should not have ${needle} channel before dispatch has been sent`
        );
        await socket.call('dispatch', event);
        assert(
          node.http.channel(needle),
          `Node server doesn't have a channel for ${needle}`
        );
      } catch (e) {
        assert(false, `Error making dispatch call: ${e.message}`);
      }
    });

    it('should be able to unsubscribe from socket subscriptions', async function() {
      const eventName = 'test remove';
      const responseEvent = 'foo bar';
      const subscription = `node-${id}:${eventName}-${responseEvent}`;

      socket.fire('subscribe', eventName, responseEvent);
      await sleep(300);
      assert(
        socketManager.channel(subscription),
        `socketManager did not have subscription for ${subscription}`
      );

      socket.fire('unsubscribe', eventName, responseEvent);
      await sleep(300);
      assert(
        !socketManager.channel(subscription),
        'Subscription channel should be removed after socket closing'
      );
    });

    // NOTE: This is not supported without an update to bsock that allows support for custom paths
    // in the socket clients. It has, however, been tested with the WIP branch of bsock
    describe('handling multiple connections', function() {
      let node2, nclient2, wclient2, id2, socket2, mineBlocks2;
      before(async function() {
        // setup our second node and clients need this to show that socket manager handles
        // connections to multiple nodes using paths
        node2 = await initFullNode({
          ports: ports.node2,
          memory: true,
          logLevel: 'none',
          apiKey: serverApiKey
        });
        nclient2 = new NodeClient({
          port: ports.node2.node,
          apiKey: serverApiKey
        });

        wclient2 = new WalletClient({
          port: ports.node2.wallet,
          apiKey: serverApiKey
        });

        // setting up the chain by mining some blocks
        const coinbase = await setupWallet(wclient2);
        const blockCount = 9;
        mineBlocks2 = async n =>
          await nclient2.execute('generatetoaddress', [n, coinbase]);
        const result = await mineBlocks2(blockCount);

        assert(
          result && result.length === blockCount,
          `Chain not initiated properly`
        );
      });

      after(async function() {
        await node2.close();
      });

      beforeEach(async function() {
        id2 = 'test';
        await socketManager.addClients(id2, {
          wallet: wclient2,
          node: nclient2
        });

        socket2 = bsock.connect(
          ports.manager,
          '127.0.0.1',
          false,
          null,
          id2
        );
        socket2.on('error', e => {
          throw e;
        });
        await socket2.call('auth', apiKey);
      });

      afterEach(async function() {
        // close connections
        await socketManager.removeClients(id2);
        await socket2.destroy();
      });

      it('should add new clients under expected id', async function() {
        assert(
          socketManager.clients.has(id2),
          `Could not find clients under ${id2}`
        );
        const clients = socketManager.clients.get(id2);
        assert(clients.wallet === wclient2, `Wrong client at ${id2}.wallet`);
        assert(clients.node === nclient2, `Wrong client at ${id2}.node`);
      });

      it("should broadcast to the right node based on the socket's path", async function() {
        await broadcastTest('chain', event, node2, socket2);
      });

      it('should only receive responseEvents for nodes it is subscribed to', async function() {
        let received = false;

        // subscription will be exactly the same as above except for the id, set by socket path
        const subscription = socketManager.getChannelName(
          'node',
          id2,
          subscribeEvent,
          responseEvent
        );

        socket2.bind(responseEvent, function() {
          received = true;
        });

        await socket2.fire('broadcast', 'watch chain');
        await sleep(300);
        await socket2.fire('subscribe', subscribeEvent, responseEvent);
        await sleep(300);
        assert(
          socketManager.channel(subscription),
          `Couldn't find subscription ${subscription}`
        );
        await mineBlocks(1);
        // need to sleep to give enough time for the block to mine
        await sleep(500);
        assert(
          !received,
          'Should not have received responseEvent after block on first node'
        );
        await mineBlocks2(1);
        await sleep(500);
        assert(received, 'Did not receive responseEvent from socketManager');
      });
    });
  });
});
