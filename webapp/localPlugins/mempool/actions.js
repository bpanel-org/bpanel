// eslint-disable-next-line import/no-unresolved
import { api } from 'bpanel/utils';

import { EMIT_SOCKET, UPDATE_MEMPOOL } from './constants';

export function broadcastSetFilter() {
  // need to set a filter for the socket to get mempool updates
  // all zeros means an open filter
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'broadcast',
      message: 'set filter',
      filter: '00000000000000000000'
    }
  };
}

export function subscribeTX() {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'subscribe',
      message: 'tx',
      responseEvent: 'mempool tx'
    }
  };
}

export function watchMempool() {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'broadcast',
      message: 'watch mempool'
    }
  };
}

export function updateMempool() {
  return async (dispatch, getState) => {
    const response = await fetch(api.get.info(), { mode: 'cors' });
    const { mempool } = await response.json();
    if (getState().chain.progress > 0.99) {
      dispatch({
        type: UPDATE_MEMPOOL,
        payload: mempool
      });
    }
  };
}

export default {
  broadcastSetFilter,
  subscribeTX,
  updateMempool,
  watchMempool
};
