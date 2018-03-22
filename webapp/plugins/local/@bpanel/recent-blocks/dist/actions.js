'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.addRecentBlock = addRecentBlock;
exports.getRecentBlocks = getRecentBlocks;

var _bcoin = require('bcoin');

var _bpanelUtils = require('@bpanel/bpanel-utils');

var _constants = require('./constants');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// can also accept raw txs array
// as it is returned in payload
function addRecentBlock(entry, txs) {
  var blockMeta = _bcoin.ChainEntry.fromRaw(entry);
  blockMeta.hash = blockMeta.rhash();
  blockMeta.txs = txs.map(function(tx) {
    return _bcoin.TX.fromRaw(tx);
  });
  return {
    type: _constants.ADD_RECENT_BLOCK,
    payload: blockMeta
  };
}

// action creator to set recent blocks on state
// mapped to the state via `mapPanelDispatch`
// which allows plugins to call action creator to update the state
function getRecentBlocks() {
  var _this = this;

  var n =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

  return (function() {
    var _ref = (0, _asyncToGenerator3.default)(
      /*#__PURE__*/ _regenerator2.default.mark(function _callee(
        dispatch,
        getState
      ) {
        var getBlocksInRange, height, count, blocks;
        return _regenerator2.default.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  getBlocksInRange = _bpanelUtils.chain.getBlocksInRange;
                  height = getState().chain.height;
                  count = n;
                  // if we have fewer blocks then the range we want to retrieve
                  // then only retrieve up to height

                  if (height < n) {
                    count = height;
                  }
                  _context.next = 6;
                  return getBlocksInRange(height, height - count, -1);

                case 6:
                  blocks = _context.sent;

                  dispatch({
                    type: _constants.SET_RECENT_BLOCKS,
                    payload: blocks
                  });

                case 8:
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

    return function(_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  })();
}

exports.default = {
  addRecentBlock: addRecentBlock,
  getRecentBlocks: getRecentBlocks
};
