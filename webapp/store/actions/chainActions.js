import { SET_CHAIN } from '../constants/chain';

export function setChainInfo(chain) {
  return {
    type: SET_CHAIN,
    payload: chain
  };
}

export default {
  setChainInfo
};
