import * as types from '../constants/app';

export function setWindowInfo(port, protocol, ssl) {
  return {
    type: types.SET_WINDOW,
    payload: { port, protocol, ssl }
  };
}

export function getWindowInfo() {
  return dispatch => {
    const port = Number(window.location.port);
    const protocol = window.location.protocol;
    let ssl = false;
    if (protocol === 'https:') ssl = true;
    dispatch(setWindowInfo(port, protocol, ssl));
  };
}

export default {
  getWindowInfo
};
