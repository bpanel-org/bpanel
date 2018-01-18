import { EMIT_SOCKET, ADD_RECENT_BLOCK } from './constants';
import { bcoinUtils, api } from 'bpanel/utils';

const { parseEntry, calcProgress } = bcoinUtils;

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

export async function addRecentBlock(entry) {
  const arrBuff = Object.keys(entry).map(key => entry[key]);
  let blockMeta = new Buffer(arrBuff);
  blockMeta = parseEntry(blockMeta);
  const { time, hash, height } = blockMeta;
  // TODO: Should probably store this in state
  let genesis = await fetch(api.get.block(0));
  genesis = await genesis.json();
  const genesisTime = genesis.time;
  // const genesis = bcoinClient.network.genesis.time;
  let progress = calcProgress(genesisTime, time);
  const chainTip = { tip: hash, progress, height };

  return {
    type: ADD_RECENT_BLOCK,
    payload: {
      ...chainTip,
      block: {
        ...blockMeta
      },
      numBlocks: 10
    }
  };
}

export default {
  addRecentBlock,
  subscribeBlockConnect,
  watchChain
};
