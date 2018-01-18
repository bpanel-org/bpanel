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
      logger.info(`Emitting "${event}" to bcoin node`);
      bcoinClient.socket.emit(event, ...args);
    });

    // requests from client to subscribe to events from node
    socket.bind('subscribe', (event, responseEvent) => {
      // doing some caching of listeners
      if (!subscriptions[event]) {
        subscriptions[event] = [responseEvent]; // cache listener
      } else if (subscriptions[event].indexOf(responseEvent) === -1) {
        subscriptions[event].push(responseEvent);
      }

      logger.debug(`Subscribing to "${event}" event on bcoin node`);
      bcoinClient.socket.on(event, (...data) => {
        logger.debug(
          `Event "${event}" received from node.`,
          `Firing "${responseEvent}" event`
        );
        socket.fire(responseEvent, ...data);
      });
    });

    bcoinClient.socket.on('error', err => {
      logger.error('Socket error: ', err);
    });
  });
})();

module.exports = socketServer;
