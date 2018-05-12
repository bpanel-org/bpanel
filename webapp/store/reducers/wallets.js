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

const initialState = {};

const walletsState = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case ADD_WALLET: {
      const { id, ...rest } = action.payload;

      if (!(id in newState)) {
        newState[id] = {};
      }

      // don't overwrite old data
      newState[id] = { ...newState[id], ...rest };
      return newState;
    }

    case REMOVE_WALLET: {
      const { id } = action.payload;
      delete newState[id];
      return newState;
    }

    case ADD_ACCOUNTS: {
      const { id, accounts } = action.payload;

      if (!(id in newState)) {
        newState[id] = {};
      }
      newState[id].accounts = accounts;
      return newState;
    }

    default:
      return state;
  }
};

export default decorateReducer(walletsState, 'walletsReducer');
