import { getClient } from '@bpanel/bpanel-utils';

import { TX } from 'bcoin';
import { Address } from 'bcash';
import { Address as HAddress } from 'hsd';
// import { TX as HTX } from 'hsd';
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
      console.log('tx:', TX);
      console.log('BCH Address:', Address);
      console.log('Handshake address:', HAddress);
      // console.log('HTX:', HTX);
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
