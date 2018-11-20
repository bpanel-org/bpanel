import { SET_WINDOW } from '../constants/app';

const initialState = {
  port: null,
  protocol: null,
  ssl: null,
  socketPort: parseInt(BPANEL_SOCKET_PORT, 10)
};

const appState = (state = initialState, action) => {
  let newState = { ...state };
  const { type, payload = {} } = action;
  switch (type) {
    case SET_WINDOW: {
      const { port, protocol, ssl, hostname } = payload;
      newState.port = port;
      newState.protocol = protocol;
      newState.ssl = ssl;
      newState.hostname = hostname;
      return newState;
    }

    default:
      return state;
  }
};

export default appState;
