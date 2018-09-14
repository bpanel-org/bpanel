const { Server } = require('bweb');

class SocketManager extends Server {
  /**
   * Create an http server.
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    super(options);
  }
}

module.exports = SocketManager;
