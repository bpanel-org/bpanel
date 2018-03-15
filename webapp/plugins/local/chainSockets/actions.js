import { ChainEntry } from 'bcoin';

import { chain as chainUtils } from '@bpanel/bpanel-utils';

export function watchChain() {
  return {
    type: 'EMIT_SOCKET',
    bsock: {
      type: 'broadcast',
      message: 'watch chain'
    }
  };
}

export function subscribeBlockConnect() {
  return {
    type: 'EMIT_SOCKET',
    bsock: {
      type: 'subscribe',
      message: 'block connect',
      responseEvent: 'new block'
    }
  };
}

export function setChainTip(entry) {
  return (dispatch, getState) => {
    const { calcProgress } = chainUtils;
    let blockMeta = ChainEntry.fromRaw(entry);
    const { time, hash, height } = blockMeta;
    const genesis = getState().chain.genesis.time;
    const prevProgress = getState().chain.progress;
    const progress = calcProgress(genesis, time);
    const chain = { tip: hash, progress, height };
    if (progress > 0.9 || progress - prevProgress > 0.0001) {
      // only update the chain tip if
      // progress is noticeably different
      // should resolve some frontend performance issues
      return dispatch({
        type: 'SET_CHAIN_INFO',
        payload: chain
      });
    }
  };
}
