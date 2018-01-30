import Immutable from 'seamless-immutable';

import { decorateReducer } from '../../plugins/plugins';
import { ADD_WALLET, UPDATE_WALLET, REMOVE_WALLET } from '../constants/wallets';

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
      if (state[id])
        throw `The wallet of id ${id} already exists in the state. UPDATE_WALLET should be used instead`;
      return state.set(id, { ...rest });
    }

    case UPDATE_WALLET: {
      const { id, ...rest } = action.payload;
      if (!state[id])
        throw `The wallet of id ${id} does not exist! Please add it first`;
      return state.set(id, { ...rest });
    }

    case REMOVE_WALLET: {
      const { id } = action.payload;
      return state.without(id);
    }

    default:
      return state;
  }
};

export default decorateReducer(walletsState, 'walletsReducer');
