import { SET_CLIENTS, SET_DEFAULT_CLIENT } from '../constants/clients';
import assert from 'bsert';

const initialState = {
  defaultClient: {},
  clients: {}
};

const clientsState = (state = initialState, action) => {
  let newState = { ...state };
  const { payload, type } = action;
  switch (type) {
    case SET_CLIENTS: {
      newState.clients = payload;
      return newState;
    }

    case SET_DEFAULT_CLIENT: {
      assert(
        typeof payload === 'object' && payload.id,
        'Must have a client object with an id'
      );
      if (state.clients[payload.id]) newState.defaultClient = payload;
      return newState;
    }

    default:
      return state;
  }
};

export default clientsState;
