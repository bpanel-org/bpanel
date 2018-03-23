'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.broadcastSetFilter = broadcastSetFilter;
exports.subscribeTX = subscribeTX;
exports.watchMempool = watchMempool;
exports.updateMempool = updateMempool;

var _bpanelUtils = require('@bpanel/bpanel-utils');

var _constants = require('./constants');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var client = (0, _bpanelUtils.bpanelClient)();

function broadcastSetFilter() {
  // need to set a filter for the socket to get mempool updates
  // all zeros means an open filter
  return {
    type: _constants.EMIT_SOCKET,
    bsock: {
      type: 'dispatch',
      message: 'set filter',
      filter: '00000000000000000000',
      acknowledge: function acknowledge() {
        return {};
      }
    }
  };
}

function subscribeTX() {
  return {
    type: _constants.EMIT_SOCKET,
    bsock: {
      type: 'subscribe',
      message: 'tx',
      responseEvent: 'mempool tx'
    }
  };
}

function watchMempool() {
  return {
    type: _constants.EMIT_SOCKET,
    bsock: {
      type: 'dispatch',
      message: 'watch mempool',
      acknowledge: function acknowledge() {
        return {};
      }
    }
  };
}

function updateMempool() {
  var _this = this;

  return (function() {
    var _ref = (0, _asyncToGenerator3.default)(
      /*#__PURE__*/ _regenerator2.default.mark(function _callee(
        dispatch,
        getState
      ) {
        var _ref2, mempool;

        return _regenerator2.default.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.next = 2;
                  return client.getInfo();

                case 2:
                  _ref2 = _context.sent;
                  mempool = _ref2.mempool;

                  if (getState().chain.progress > 0.9) {
                    dispatch({
                      type: _constants.UPDATE_MEMPOOL,
                      payload: mempool
                    });
                  }

                case 5:
                case 'end':
                  return _context.stop();
              }
            }
          },
          _callee,
          _this
        );
      })
    );

    return function(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
}

exports.default = {
  broadcastSetFilter: broadcastSetFilter,
  subscribeTX: subscribeTX,
  updateMempool: updateMempool,
  watchMempool: watchMempool
};
