import { getClient } from '@bpanel/bpanel-utils';
import { SET_DEFAULT_CLIENT, SET_CLIENTS } from '../constants/clients';

const client = getClient();

function setClients(clients) {
  return {
    type: SET_CLIENTS,
    payload: clients
  };
}

export function setCurrentClient(clientInfo) {
  const { id, chain = 'bitcoin' } = clientInfo;
  // set the client info for the global client
  if (id) client.setClientInfo(id, chain);
  return {
    type: SET_DEFAULT_CLIENT,
    payload: clientInfo
  };
}

export function getClients() {
  return async dispatch => {
    const clients = await client.getClients();
    dispatch(setClients(clients));
  };
}

export function getCurrentClient() {
  return async dispatch => {
    const currentClient = await client.getDefault();
    dispatch(setCurrentClient(currentClient));
  };
}

export function hydrateClients() {
  return async dispatch => {
    try {
      await dispatch(getClients());
      await dispatch(getCurrentClient());
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('There was an error hydrating clients:', e);
    }
  };
}

export default {
  hydrateClients
};
