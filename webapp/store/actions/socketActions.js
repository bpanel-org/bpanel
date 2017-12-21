import { CONNECT_SOCKET, DISCONNECT_SOCKET } from '../constants/sockets';

export function connectSocket() {
  return {
    type: CONNECT_SOCKET,
    bsock: {
      host: 'localhost',
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
