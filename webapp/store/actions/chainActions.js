import { SET_CHAIN_TIP } from '../constants/chain';

export function setChainInfo(chain) {
  return {
    type: SET_CHAIN_TIP,
    payload: chain
  };
}

export default {
  setChainInfo
};
