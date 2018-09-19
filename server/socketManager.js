const { Server } = require('bweb');
const assert = require('bsert');

class SocketManager extends Server {
  /**
   * Create an http server.
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    // super(new SocketManagerOptions(options));
    super(options);
    return this;
  }

  // initSockets() {

  // }

  addClients() {}

  removeClients() {}
}

class SocketManagerOptions {
  /**
   * SocketManagerOptions
   * @alias module:http.SocketManagerOptions
   * @constructor
   * @param {Object} options
   */

  constructor(options) {
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
//
module.exports = SocketManager;
