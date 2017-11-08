import fetch from 'isomorphic-fetch';

import * as types from '../constants';

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
  return dispatch => {
    dispatch(requestingNode(true));
    return fetch('/node')
      .then(response => JSON.parse(response))
      .then(nodeObject => {
        dispatch(requestingNode(false));
        dispatch(setNodeInfo(nodeObject));
      });
  };
}
