import { EMIT_SOCKET } from './constants';

export function joinWallet() {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'broadcast',
      message: 'wallet join'
    }
  };
}

export function watchTX() {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'subscribe',
      message: 'wallet tx',
      responseEvent: 'wallet tx'
    }
  };
}
