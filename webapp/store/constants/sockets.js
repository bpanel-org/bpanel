import { CHAIN_PROGRESS } from './chain';

export const CONNECT_SOCKET = 'CONNECT_SOCKET';

export const socketListeners = [
  {
    event: 'chain progress',
    actionType: CHAIN_PROGRESS
  }
];
