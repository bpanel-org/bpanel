import { getClient } from '@bpanel/bpanel-utils';

import * as types from '../constants/node';
import { setChainInfo, getGenesisBlock } from './chainActions';

const client = getClient();

export function setNodeInfo(info) {
  return {
    type: types.SET_NODE,
    payload: info
  };
}

export function requestingNode(loadingState) {
  return {
    type: types.SET_LOADING,
    payload: loadingState
  };
}

export function getNodeInfo() {
  return async dispatch => {
    dispatch(requestingNode(true));
    dispatch(getGenesisBlock());
    try {
      const nodeInfo = await client.node.getInfo();
      dispatch(requestingNode(false));
      dispatch(setNodeInfo(nodeInfo));
      dispatch(setChainInfo(nodeInfo.chain));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };
}

export default {
  setNodeInfo,
  requestingNode,
  getNodeInfo
};
