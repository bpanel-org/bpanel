const logger = require('./logger');

const socketHandler = (nodeClient, walletClient) => {
  const walletPrefix = 'wallet ';
  const subscriptions = {}; // cache to manage subscriptions made by clients
  return async socket => {
    // requests from client for messages to be broadcast to node
    socket.bind('broadcast', (event, ...args) => {
      /**
        // Example broadcast from client:
        socket.fire('broadcast', 'set filter', '00000000000000000000');
        // which will result in the following fire to bcoin server
        nodeClient.socket.fire('set filter', '00000000000000000000');
      **/
      // use wallet client if subscribing to wallet event
      if (event.indexOf(walletPrefix) > -1) {
        // need to slice out prefix since wallet server
        // is now separate and no longer needs/recognizes the prefix
        const walletEvent = event.slice(walletPrefix.length);
        logger.debug(`Firing "${walletEvent}" to wallet server`);
        walletClient.call(walletEvent, ...args);
      } else {
        logger.debug(`Firing "${event}" to bcoin node`);
        nodeClient.call(event, ...args);
      }
    });

    // requests from client to subscribe to events from node
    // client should indicate the event to listen for
    // and the `responseEvent` to fire when the event is heard
    socket.bind('subscribe', (event, responseEvent) => {
      // doing some caching of listeners
      if (!subscriptions[event]) {
        subscriptions[event] = [responseEvent]; // cache listener
      } else if (subscriptions[event].indexOf(responseEvent) === -1) {
        subscriptions[event].push(responseEvent);
      }

      // use wallet client if subscribing to wallet event
      if (event.indexOf(walletPrefix) > -1) {
        // need to slice out prefix since wallet server
        // is now separate and no longer needs/recognizes the prefix
        const walletEvent = event.slice(walletPrefix.length);
        logger.debug(`Subscribing to "${walletEvent}" event on wallet server`);

        walletClient.bind(walletEvent, (...data) => {
          logger.debug(
            `Event "${walletEvent}" received from wallet server.`,
            `Firing "${responseEvent}" event`
          );
          socket.fire(responseEvent, ...data);
        });
      } else {
        logger.debug(`Subscribing to "${event}" event on bcoin node`);
        nodeClient.bind(event, (...data) => {
          logger.debug(
            `Event "${event}" received from node.`,
            `Firing "${responseEvent}" event`
          );
          socket.fire(responseEvent, ...data);
        });
      }
    });

    nodeClient.on('error', err => {
      logger.error('Socket error (node): ', err);
    });
    walletClient.on('error', err => {
      logger.error('Socket error (wallet): ', err);
    });
  };
};

module.exports = socketHandler;
