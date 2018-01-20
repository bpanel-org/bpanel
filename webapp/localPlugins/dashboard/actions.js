import { ChainEntry } from 'bcoin';
// eslint-disable-next-line import/no-unresolved
import { chain as chainUtils } from 'bpanel/utils';

import { EMIT_SOCKET, ADD_RECENT_BLOCK, SET_RECENT_BLOCKS } from './constants';

const { calcProgress } = chainUtils;

export function watchChain() {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'broadcast',
      message: 'watch chain'
    }
  };
}

export function subscribeBlockConnect() {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'subscribe',
      message: 'block connect',
      responseEvent: 'new block'
    }
  };
}

// can also accept raw txs array
// as it is returned in payload
export async function addRecentBlock(entry) {
  return (dispatch, getState) => {
    let blockMeta = ChainEntry.fromRaw(entry);
    const { time, hash, height } = blockMeta;
    const genesis = getState().chain.genesis.time;
    let progress = calcProgress(genesis, time);
    const chainTip = { tip: hash, progress, height };

    dispatch({
      type: ADD_RECENT_BLOCK,
      payload: {
        ...chainTip,
        block: {
          ...blockMeta
        },
        numBlocks: 10
      }
    });
  };
}

// action creator to set recent blocks on state
// mapped to the state via `mapPanelDispatch`
// which allows plugins to call action creator to update the state
export function getRecentBlocks(n = 10) {
  return async (dispatch, getState) => {
    const { getBlocksInRange } = chainUtils;
    const { height, progress, tip } = getState().chain;
    // only get recent blocks if node is almost fully synced
    // UI gets clogged otherwise
    if (progress < 0.9)
      dispatch({
        type: SET_RECENT_BLOCKS,
        payload: [{ height, hash: tip }]
      });
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
  getRecentBlocks,
  subscribeBlockConnect,
  watchChain
};
