import { CONNECT_SOCKET, DISCONNECT_SOCKET } from '../constants/sockets';
import { getClient } from '@bpanel/bpanel-utils';

const client = getClient();

export function connectSocket() {
  return {
    type: CONNECT_SOCKET,
    bsock: {
      host: client.host ? client.host : 'localhost',
      port: 8000,
      namespace: client.id
    }
  };
}

export const disconnectSocket = () => ({
  type: DISCONNECT_SOCKET,
  bsock: {}
});

export default {
  connectSocket,
  disconnectSocket
};
