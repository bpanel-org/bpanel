import { CONNECT_SOCKET } from '../constants/sockets';

export function connectSocket() {
  return {
    type: CONNECT_SOCKET,
    bsock: {
      host: 'localhost',
      port: 8000
    }
  };
}

export default {
  connectSocket
};
