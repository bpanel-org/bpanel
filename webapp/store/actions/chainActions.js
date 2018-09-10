import { getClient } from '@bpanel/bpanel-utils';

import { SET_CHAIN_INFO, SET_GENESIS } from '../constants/chain';

const client = getClient();

export function setChainInfo(chain) {
  return {
    type: SET_CHAIN_INFO,
    payload: chain
  };
}

function setGenesisBlock(block) {
  return {
    type: SET_GENESIS,
    payload: block
  };
}

export function getGenesisBlock() {
  return async dispatch => {
    try {
      if (client.node) {
        let genesis = await client.node.getBlock(0);
        dispatch(setGenesisBlock(genesis));
      }
    } catch (e) {
      throw `Error getting genesis block: ${e.stack}`;
    }
  };
}

export default {
  getGenesisBlock,
  setChainInfo,
  setGenesisBlock
};
