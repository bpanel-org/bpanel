import { CONNECT_SOCKET, DISCONNECT_SOCKET } from '../constants/sockets';
import { bpanelClient } from '@bpanel/bpanel-utils';

export function connectSocket() {
  const client = bpanelClient();
  return {
    type: CONNECT_SOCKET,
    bsock: {
      host: client.host ? client.host : 'localhost',
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
