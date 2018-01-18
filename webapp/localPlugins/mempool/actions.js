import { EMIT_SOCKET } from './constants';

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

export default {
  broadcastSetFilter,
  subscribeTX,
  watchMempool
};
