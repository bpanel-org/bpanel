import { api } from 'bpanel/utils';

import {
  ADD_WALLET,
  ADD_ACCOUNTS,
  ADD_WALLET_TX,
  EMIT_SOCKET,
  REMOVE_WALLET,
  UPDATE_ADDRESS
} from './constants';

const getAccounts = async id => {
  let accounts = await fetch(api.get.accounts(id));
  return await accounts.json();
};

export function joinWallet(id, token) {
  return async dispatch => {
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

export const removeWallet = id => {
  // eslint-disable-next-line no-console
  console.log(`Left wallet "${id}"`);
  return {
    type: REMOVE_WALLET,
    payload: { id }
  };
};

const acknowledgeJoin = id => {
  return async dispatch => {
    // eslint-disable-next-line no-console
    console.log(`Joined wallet "${id}"`);

    let wallet = await fetch(api.get.wallet(id));
    wallet = await wallet.json();
    dispatch({
      type: ADD_WALLET,
      payload: { id, ...wallet }
    });
    const accounts = await getAccounts(id);
    dispatch(addAccounts(id, accounts));
    // We are going to default to the first account
    // which is probably `default`
    // in a real application you'll probably want to make this more robust
    const address = await getReceiveAddress(id, accounts[0]);
    dispatch(updateAddress(id, address));
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

export function addWalletTX(id, tx) {
  return {
    type: ADD_WALLET_TX,
    payload: { id, tx }
  };
}

export function addWallet(wallet) {
  return {
    type: ADD_WALLET,
    payload: { id: wallet.id, ...wallet }
  };
}

export const addAccounts = (id, accounts) => ({
  type: ADD_ACCOUNTS,
  payload: { id, accounts }
});

export const getReceiveAddress = async (id, accountID) => {
  let account = await fetch(api.get.account(id, accountID));
  account = await account.json();
  return account.receiveAddress;
};

export const updateAddress = (id, address) => ({
  type: UPDATE_ADDRESS,
  payload: { id, address }
});
