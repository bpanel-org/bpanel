import { EMIT_SOCKET } from './constants';

export function joinWallet(id, token) {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'broadcast',
      message: 'wallet join',
      id,
      token
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
