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

io.on('socket', async socket => {
  await bcoinClient.open();
  bcoinClient.socket.emit('auth');
  bcoinClient.socket.emit('watch chain');
  bcoinClient.socket.on('block connect', async entry => {
    try {
      let blockMeta;
      blockMeta = parseEntry(entry);
      const genesis = bcoinClient.network.genesis.time;
      let progress = calcProgress(genesis, blockMeta.time);
      socket.fire('chain progress', Buffer.from(progress.toString()));
    } catch (err) {
      logger.error('Socket error in client.getInfo', err);
    }
  });
  bcoinClient.socket.on('error', err => {
    logger.error('Socket error: ', err);
  });
});

module.exports = socketServer;
