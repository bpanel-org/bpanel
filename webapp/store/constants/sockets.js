import { ADD_NEW_BLOCK } from './chain';

export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const DISCONNECT_SOCKET = 'DISCONNECT_SOCKET';
export const EMIT_SOCKET = 'EMIT_SOCKET';

// This array will get added to by plugins
// who need to set their own listeners
export const listeners = [
  {
    event: 'new block',
    actionType: ADD_NEW_BLOCK
  }
];
