'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.getPeers = getPeers;

var _bpanelUtils = require('@bpanel/bpanel-utils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var client = (0, _bpanelUtils.bpanelClient)();

function setPeers(peers) {
  return {
    type: 'SET_PEERS',
    payload: peers
  };
}

function getPeers() {
  var _this = this;

  return (function() {
    var _ref = (0, _asyncToGenerator3.default)(
      /*#__PURE__*/ _regenerator2.default.mark(function _callee(dispatch) {
        var peersList;
        return _regenerator2.default.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.next = 2;
                  return client.execute('getpeerinfo');

                case 2:
                  peersList = _context.sent;

                  dispatch(setPeers(peersList));

                case 4:
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

    return function(_x) {
      return _ref.apply(this, arguments);
    };
  })();
}
