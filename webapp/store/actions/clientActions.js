import { getClient } from '@bpanel/bpanel-utils';
import {
  SET_CURRENT_CLIENT,
  SET_CLIENTS,
  CLEAR_CURRENT_CLIENT
} from '../constants/clients';
import { STATE_REFRESHED, RESET_STATE } from '../constants/app';
import { disconnectSocket, connectSocket } from './socketActions';
import { setClientsHydrated } from './appActions';

const client = getClient();

function setClients(clients) {
  return {
    type: SET_CLIENTS,
    payload: clients
  };
}

function clearCurrentClient() {
  return {
    type: CLEAR_CURRENT_CLIENT
  };
}

function setCurrentClient(clientInfo) {
  return async dispatch => {
    if (!clientInfo.chain && clientInfo.id)
      // eslint-disable-next-line no-console
      console.warn(
        `No chain was set for client ${clientInfo.id}, defaulting to "bitcoin"`
      );
    const { id, chain = 'bitcoin' } = clientInfo;
    // get current information for client from server
    const client = getClient();
    const info = await client.getClientInfo(id, true);
    // set the client info for the global client
    if (id) client.setClientInfo(id, chain);
    return dispatch({
      type: SET_CURRENT_CLIENT,
      payload: { ...clientInfo, ...info }
    });
  };
}

function resetClient() {
  return dispatch => {
    dispatch(disconnectSocket());
    dispatch(connectSocket());
    dispatch({
      type: RESET_STATE
    });
    dispatch({
      type: STATE_REFRESHED
    });
  };
}

function getClients() {
  return async dispatch => {
    const clients = await client.getClients();
    dispatch(setClients(clients));
  };
}

function getDefaultClient() {
  return async dispatch => {
    const defaultClient = await client.getDefault();
    if (defaultClient) return dispatch(setCurrentClient(defaultClient));
    return dispatch(clearCurrentClient());
  };
}

function hydrateClients() {
  return async (dispatch, getState) => {
    try {
      await dispatch(getClients());
      const currentClient = getState().clients.currentClient;
      const clients = getState().clients.clients;

      // if there is no currentClient set or
      // the currentClient does not exist in clients store
      // reset the currentClient to a default from the server
      if (!currentClient.id || !clients[currentClient.id])
        await dispatch(getDefaultClient());
      else await dispatch(setCurrentClient(currentClient));

      // set clientsHydrated to true in state
      // so other parts of the app can start listening
      // for client changs
      return dispatch(setClientsHydrated(true));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('There was an error hydrating clients:', e);
    }
  };
}

export default {
  hydrateClients,
  getDefaultClient,
  getClients,
  resetClient,
  setCurrentClient,
  setClients
};
