import { CONNECT_SOCKET, DISCONNECT_SOCKET } from '../constants/sockets';
import { getClient } from '@bpanel/bpanel-utils';

const client = getClient();

export function connectSocket() {
  return {
    type: CONNECT_SOCKET,
    bsock: {
      host: bpClient.host ? bpClient.host : 'localhost',
      port: 8000
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
