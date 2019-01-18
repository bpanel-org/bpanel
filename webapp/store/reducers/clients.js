import {
  ADD_CLIENT,
  REMOVE_CLIENT,
  SET_CLIENTS,
  SET_CURRENT_CLIENT,
  UPDATE_CLIENT,
  CLEAR_CURRENT_CLIENT,
  CLIENTS_HYDRATED
} from '../constants/clients';
import assert from 'bsert';

const initialState = {
  currentClient: {},
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

    case SET_CURRENT_CLIENT: {
      assert(
        typeof payload === 'object' && payload.id,
        'Must have a client object with an id'
      );
      newState.currentClient = payload;
      return newState;
    }

    case UPDATE_CLIENT: {
      const { id, info } = payload;
      assert(
        typeof payload === 'object' && id && info,
        'Must have a client object with an id and info'
      );

      // make a copy of the clients object to keep redux immutability
      newState.clients = { ...newState.clients };
      assert(newState.clients[id], `Client "${id}" does not exist`);
      newState.clients[id] = info;
      return newState;
    }

    case ADD_CLIENT: {
      const { id, info } = payload;
      assert(
        !newState.clients[payload.id],
        `Client with the id ${payload.id} already exists. Can't add duplicate.`
      );
      newState.clients = { ...newState.clients, [id]: info };
      return newState;
    }

    case REMOVE_CLIENT: {
      const { id } = payload;
      delete newState.clients[id];
      newState.clients = { ...newState.clients };
      return newState;
    }

    case CLEAR_CURRENT_CLIENT: {
      newState.currentClient = {};
      return newState;
    }

    case CLIENTS_HYDRATED: {
      newState.clientsHydrated = action.payload;
      return newState;
    }

    default:
      return state;
  }
};

export default clientsState;
