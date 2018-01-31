import Immutable from 'seamless-immutable';

import { decorateReducer } from '../../plugins/plugins';
import { ADD_ACCOUNTS, ADD_WALLET, REMOVE_WALLET } from '../constants/wallets';

/*
  wallets state should be structured where key is wallet id
  and value is object of wallet properties
  e.g.
  {
    primary: {
      balance,
      receiveAddress,
      changeAddress,
      ...
    }
  }
*/

const initialState = Immutable({});

const walletsState = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WALLET: {
      const { id, ...rest } = action.payload;
      return state.set(id, { ...rest });
    }

    case REMOVE_WALLET: {
      const { id } = action.payload;
      return state.without(id);
    }

    case ADD_ACCOUNTS: {
      const { id, accounts } = action.payload;
      return state.setIn([id, 'accounts'], accounts);
    }

    default:
      return state;
  }
};

export default decorateReducer(walletsState, 'walletsReducer');
