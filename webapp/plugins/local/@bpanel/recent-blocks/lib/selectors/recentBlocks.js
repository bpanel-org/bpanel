import { createSelector } from 'reselect';

const getBlocks = state => state.chain.getIn(['recentBlocks']);

const setTxCount = blocks =>
  blocks.map(block => {
    const txs = block.getIn(['txs']);
    const txCount = txs ? txs.length : '';
    return block.set('txs', txCount);
  });

const getBlocksWithTxCount = createSelector([getBlocks], setTxCount);

export default {
  getBlocksWithTxCount
};
