import { EMIT_SOCKET, ADD_WALLET } from './constants';

export function joinWallet(id, token) {
  return dispatch => {
    dispatch({
      type: EMIT_SOCKET,
      bsock: {
        type: 'broadcast',
        message: 'wallet join',
        id,
        token,
        acknowledge: () => {
          dispatch(acknowledgeJoin({ id }));
        }
      }
    });
  };
}

export function leaveWallet(id) {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'broadcast',
      message: 'wallet leave',
      id
    }
  };
}

const acknowledgeJoin = ({ id }) => {
  return {
    type: ADD_WALLET,
    payload: { id }
  };
};

export function watchTX() {
  return {
    type: EMIT_SOCKET,
    bsock: {
      type: 'subscribe',
      message: 'wallet tx',
      responseEvent: 'wallet tx'
    }
  };
}
