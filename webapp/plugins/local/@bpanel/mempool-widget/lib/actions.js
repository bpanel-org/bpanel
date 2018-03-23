import { bpanelClient } from '@bpanel/bpanel-utils';

import { EMIT_SOCKET, UPDATE_MEMPOOL } from './constants';

const client = bpanelClient();

export function broadcastSetFilter() {
  // need to set a filter for the socket to get mempool updates
  // all zeros means an open filter
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'dispatch',
      message: 'set filter',
      filter: '00000000000000000000',
      acknowledge: () => ({})
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
      type: 'dispatch',
      message: 'watch mempool',
      acknowledge: () => ({})
    }
  };
}

export function updateMempool() {
  return async (dispatch, getState) => {
    const { mempool } = await client.getInfo();
    if (getState().chain.progress > 0.9) {
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
