const http = require('http');
const path = require('path');
const bsock = require('bsock');
const io = bsock.createServer();
const socketServer = http.createServer();
const { NodeClient } = require('bclient');

const logger = require('./logger');

const config = require(path.resolve(__dirname, '../configs/bcoin.config.json'));
const { network, port, apiKey, host } = config;

const nodeClient = new NodeClient({
  apiKey,
  network,
  host,
  port: typeof port === 'number' ? port : parseInt(port)
});

io.attach(socketServer);
const subscriptions = {}; // cache to manage subscriptions made by clients

const socketHandler = async socket => {
  // requests from client for messages to be broadcast to node
  socket.bind('broadcast', (event, ...args) => {
    /**
      // Example broadcast from client:
      socket.fire('broadcast', 'set filter', '00000000000000000000');
      // which will result in the following fire to bcoin server
      nodeClient.socket.fire('set filter', '00000000000000000000');
    **/
    logger.info(`Firing "${event}" to bcoin node`);
    nodeClient.fire(event, ...args);
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
    nodeClient.bind(event, (...data) => {
      logger.debug(
        `Event "${event}" received from node.`,
        `Firing "${responseEvent}" event`
      );
      socket.fire(responseEvent, ...data);
    });
  });

  nodeClient.socket.on('error', err => {
    logger.error('Socket error: ', err);
  });
};

(async function() {
  await nodeClient.open();
  nodeClient.fire('auth');
  io.on('socket', socketHandler);
})();

module.exports = { socketServer, socketHandler };
