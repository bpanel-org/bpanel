import * as types from '../constants/app';

export function setWindowInfo(port, protocol, hostname, ssl) {
  return {
    type: types.SET_WINDOW,
    payload: { port, protocol, hostname, ssl }
  };
}

export function getWindowInfo() {
  return dispatch => {
    let port;
    // when served on port 80 or 443
    if (window.location.port) port = Number(window.location.port);

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    let ssl = false;
    if (protocol === 'https:') ssl = true;
    dispatch(setWindowInfo(port, protocol, hostname, ssl));
  };
}

export default {
  getWindowInfo
};
