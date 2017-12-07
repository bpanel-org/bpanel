import * as types from '../constants/node';

export function setNodeInfo(info) {
  return {
    type: types.SET_NODE,
    payload: info
  };
}

export function updateChainInfo(chain) {
  return {
    type: types.SET_CHAIN,
    payload: chain
  };
}

export function requestingNode(loadingState) {
  return {
    type: types.SET_LOADING,
    payload: loadingState
  };
}

export function setBcoinUri(uri) {
  return {
    type: types.SET_BCOIN_URI,
    payload: uri
  };
}

export function getNodeInfo() {
  return dispatch => {
    dispatch(requestingNode(true));
    dispatch(getServerInfo());
    return fetch('/node')
      .then(response => response.json())
      .then(nodeInfo => {
        dispatch(requestingNode(false));
        dispatch(setNodeInfo(nodeInfo));
      })
      .catch(e => e);
  };
}

export function getServerInfo() {
  return dispatch => {
    return fetch('/server')
      .then(response => response.json())
      .then(serverInfo => {
        dispatch(setBcoinUri(serverInfo.bcoinUri));
      })
      .catch(e => e);
  };
}
export default {
  setNodeInfo,
  requestingNode,
  getNodeInfo,
  updateChainInfo
};
