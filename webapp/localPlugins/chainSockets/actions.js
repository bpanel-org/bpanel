import { ChainEntry } from 'bcoin';
// eslint-disable-next-line import/no-unresolved
import { chain as chainUtils } from 'bpanel/utils';

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
    let progress = calcProgress(genesis, time);
    const chain = { tip: hash, progress, height };

    return dispatch({
      type: 'SET_CHAIN_INFO',
      payload: chain
    });
  };
}
