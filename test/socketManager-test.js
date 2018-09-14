const { assert } = require('chai');
const { Server } = require('bweb');

const SocketManager = require('../server/socketManager');

describe.only('socketManager', () => {
  it('should initialize a SocketManager', () => {
    const socketManager = new SocketManager({});

    assert.instanceOf(
      socketManager,
      Server,
      'SocketManager should be an instance of a bweb Server'
    );
  });
});
