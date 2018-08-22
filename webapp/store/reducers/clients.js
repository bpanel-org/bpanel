import { HYDRATE_CLIENTS, SET_DEFAULT_CLIENT } from '../constants/clients';
import assert from 'bsert';

const initialState = {
  currentClient: {},
  clients: {}
};

const clientsState = (state = initialState, action) => {
  let newState = { ...state };
  const { payload, type } = action;
  switch (type) {
    case HYDRATE_CLIENTS: {
      newState.clients = payload;
      return newState;
    }

    case SET_DEFAULT_CLIENT: {
      assert(
        typeof payload === 'object' && payload.id,
        'Must have a client object with an id'
      );
      newState.currentClient = payload;
      return newState;
    }

    default:
      return state;
  }
};

export default clientsState;
