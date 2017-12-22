import { SET_CHAIN_TIP } from './chain';

export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const DISCONNECT_SOCKET = 'DISCONNECT_SOCKET';

export const listeners = [
  {
    event: 'chain progress',
    actionType: SET_CHAIN_TIP
  }
];
