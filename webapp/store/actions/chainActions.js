import { api } from 'bpanel-utils';
import { SET_CHAIN_INFO, SET_GENESIS } from '../constants/chain';

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
      let genesis = await fetch(api.get.block(0));
      genesis = await genesis.json();
      dispatch(setGenesisBlock(genesis));
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
