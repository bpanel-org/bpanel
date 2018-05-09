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
  switch (action.type) {
    case ADD_WALLET: {
      const { id, ...rest } = action.payload;
      return Object.assign({}, state, { [id]: { ...rest } });
    }

    case REMOVE_WALLET: {
      const { id } = action.payload;
      const _return = Object.assign({}, state);
      delete _return[id];
      return _return;
    }

    case ADD_ACCOUNTS: {
      const { id, accounts } = action.payload;
      return Object.assign({}, state, { [id]: { accounts } });
    }

    default:
      return state;
  }
};

export default decorateReducer(walletsState, 'walletsReducer');
