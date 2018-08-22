import { HYDRATE_CLIENTS, SET_DEFAULT_CLIENT } from '../constants/clients';
import assert from 'bsert';

const initialState = {
  default: '',
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
        typeof payload === 'string',
        'Payload for SET_DEFAULT must be a string'
      );
      if (state.clients[payload]) newState.default = payload;
      return newState;
    }

    default:
      return state;
  }
};

export default clientsState;
