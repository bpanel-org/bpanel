import { ChainEntry } from 'bcoin';
import { chain as chainUtils } from 'bpanel-utils';

import { ADD_RECENT_BLOCK, SET_RECENT_BLOCKS } from './constants';

// can also accept raw txs array
// as it is returned in payload
export function addRecentBlock(entry) {
  let blockMeta = ChainEntry.fromRaw(entry);
  blockMeta.hash = blockMeta.rhash();
  return {
    type: ADD_RECENT_BLOCK,
    payload: blockMeta
  };
}

// action creator to set recent blocks on state
// mapped to the state via `mapPanelDispatch`
// which allows plugins to call action creator to update the state
export function getRecentBlocks(n = 10) {
  return async (dispatch, getState) => {
    const { getBlocksInRange } = chainUtils;
    const { height } = getState().chain;
    let count = n;
    // if we have fewer blocks then the range we want to retrieve
    // then only retrieve up to height
    if (height < n) {
      count = height;
    }
    const blocks = await getBlocksInRange(height, height - count, -1);
    dispatch({
      type: SET_RECENT_BLOCKS,
      payload: blocks
    });
  };
}

export default {
  addRecentBlock,
  getRecentBlocks
};
