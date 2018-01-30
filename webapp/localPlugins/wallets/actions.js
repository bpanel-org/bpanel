import {
  EMIT_SOCKET,
  ADD_WALLET,
  UPDATE_WALLET,
  REMOVE_WALLET
} from './constants';

export function joinWallet(id, token) {
  return (dispatch, getState) => {
    const wallet = getState().wallets[id];
    if (wallet) {
      return dispatch({
        type: UPDATE_WALLET,
        payload: { id }
      });
    }
    return dispatch({
      type: EMIT_SOCKET,
      bsock: {
        type: 'broadcast',
        message: 'wallet join',
        id,
        token,
        acknowledge: () => dispatch(acknowledgeJoin(id))
      }
    });
  };
}

export function leaveWallet(id) {
  return dispatch => {
    dispatch({
      type: EMIT_SOCKET,
      bsock: {
        type: 'broadcast',
        message: 'wallet leave',
        id,
        acknowledge: () => dispatch(removeWallet(id))
      }
    });
  };
}

export const removeWallet = id => ({
  type: REMOVE_WALLET,
  payload: { id }
});

const acknowledgeJoin = id => ({
  type: ADD_WALLET,
  payload: { id }
});

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
