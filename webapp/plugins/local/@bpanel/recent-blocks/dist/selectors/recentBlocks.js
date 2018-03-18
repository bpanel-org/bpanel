'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _reselect = require('reselect');

var getBlocks = function getBlocks(state) {
  return state.chain.getIn(['recentBlocks']);
};

var setTxCount = function setTxCount(blocks) {
  return blocks.map(function(block) {
    var txs = block.getIn(['txs']);
    var txCount = txs ? txs.length : '';
    return block.set('txs', txCount);
  });
};

var getBlocksWithTxCount = (0, _reselect.createSelector)(
  [getBlocks],
  setTxCount
);

exports.default = {
  getBlocksWithTxCount: getBlocksWithTxCount
};
