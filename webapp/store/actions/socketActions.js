export function connectSocket() {
  return {
    type: 'CONNECT',
    bsock: {
      host: 'localhost',
      port: 8000
    }
  };
}

export default {
  connectSocket
};
