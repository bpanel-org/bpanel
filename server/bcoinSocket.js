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
  bcoinClient.socket.emit('watch chain');
  bcoinClient.socket.emit('watch mempool');
  // need to set a filter for the socket to get mempool updates
  // all zeros means an open filter
  bcoinClient.socket.emit('set filter', '00000000000000000000');

  io.on('socket', async socket => {
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
