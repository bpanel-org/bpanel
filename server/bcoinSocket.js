const http = require('http');
const path = require('path');
const bsock = require('bsock');
const io = bsock.createServer();
const socketServer = http.createServer();
const bcoin = require('bcoin');
const Client = bcoin.http.Client;

const logger = require('./logger');
const { parseEntry, calcProgress } = require('./helpers/bcoinUtils');

const config = require(path.resolve(__dirname, '../configs/bcoin.config.json'));
const { network, uri, apiKey } = config;
const bcoinClient = new Client({ network, uri, apiKey });

io.attach(socketServer);

(async function() {
  await bcoinClient.open();
  bcoinClient.socket.emit('auth');

  const subscriptions = {}; // cache to manage subscriptions made by clients

  io.on('socket', async socket => {
    // requests from client for messages to be broadcast to node
    socket.bind('broadcast', (event, ...args) => {
      /**
        // Example broadcast from client:
        socket.fire('broadcast', 'set filter', '00000000000000000000');
        // which will result in the following emit to bcoin server
        bcoinClient.socket.emit('set filter', '00000000000000000000');
      **/
      logger.info(`Emitting ${event} to bcoin node`);
      bcoinClient.socket.emit(event, ...args);
    });

    // requests from client to subscribe to events from node
    socket.bind('subscribe', (event, handler) => {
      if (subscriptions[event]) {
        // already subscribed to this event
        logger.info(
          `Attempt to subscribe to ${event} skipped because subscription already exists`
        );
        return;
      }
      logger.info(`Subscribing to ${event} event on bcoin node`);
      bcoinClient.socket.on(event, handler(socket));
      subscriptions[event] = handler(socket); // cache listener
      logger.info('Existing subscriptions: ', subscriptions);
    });

    bcoinClient.socket.on('block connect', (entry, txs) => {
      try {
        let blockMeta;
        blockMeta = parseEntry(entry);
        const { time, hash, height } = blockMeta;
        const genesis = bcoinClient.network.genesis.time;

        let progress = calcProgress(genesis, time);
        const chainTip = { tip: hash, progress, height };
        socket.fire('chain progress', { ...chainTip, block: { entry, txs } });
      } catch (err) {
        logger.error('Socket error in client.getInfo', err);
      }
    });

    bcoinClient.socket.on('tx', async raw => {
      socket.fire('mempool tx', raw);
      const { mempool } = await bcoinClient.getInfo();
      socket.fire('update mempool', mempool);
    });

    bcoinClient.socket.on('error', err => {
      logger.error('Socket error: ', err);
    });
  });
})();

module.exports = socketServer;
