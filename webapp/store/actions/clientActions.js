import { getClient } from '@bpanel/bpanel-utils';
import { SET_CURRENT_CLIENT, SET_CLIENTS } from '../constants/clients';

const client = getClient();

function setClients(clients) {
  return {
    type: SET_CLIENTS,
    payload: clients
  };
}

function setCurrentClient(clientInfo) {
  const { id, chain = 'bitcoin' } = clientInfo;
  // set the client info for the global client
  if (id) client.setClientInfo(id, chain);
  return {
    type: SET_CURRENT_CLIENT,
    payload: clientInfo
  };
}

function resetClient() {
  return {
    type: 'RESET_STATE'
  };
}

function getClients() {
  return async dispatch => {
    const clients = await client.getClients();
    dispatch(setClients(clients));
  };
}

function getCurrentClient() {
  return async dispatch => {
    const currentClient = await client.getDefault();
    dispatch(setCurrentClient(currentClient));
  };
}

function hydrateClients() {
  return async (dispatch, getState) => {
    try {
      await dispatch(getClients());
      let currentClient = getState().clients.currentClient;
      if (!currentClient) {
        await dispatch(getCurrentClient());
        currentClient = getState().clients.currentClient;
      } else {
        dispatch(setCurrentClient(currentClient));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('There was an error hydrating clients:', e);
    }
  };
}

export default {
  hydrateClients,
  getCurrentClient,
  getClients,
  resetClient,
  setCurrentClient,
  setClients
};
