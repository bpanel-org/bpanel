import { SET_CHAIN } from './chain';

export const CONNECT_SOCKET = 'CONNECT_SOCKET';

export const socketListeners = [
  {
    event: 'new block',
    actionType: SET_CHAIN
  }
];
