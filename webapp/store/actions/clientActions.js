import { getClient } from '@bpanel/bpanel-utils';
import { SET_CURRENT_CLIENT, SET_CLIENTS } from '../constants/clients';
import { STATE_REFRESHED, RESET_STATE } from '../constants/app';
import { disconnectSocket, connectSocket } from './socketActions';

const client = getClient();

function setClients(clients) {
  return {
    type: SET_CLIENTS,
    payload: clients
  };
}

function setCurrentClient(clientInfo) {
  return async (dispatch, getState) => {
    if (!clientInfo.chain && clientInfo.id)
      // eslint-disable-next-line no-console
      console.warn(
        `No chain was set for client ${clientInfo.id}, defaulting to "bitcoin"`
      );
    const { id, chain = 'bitcoin' } = clientInfo;

    // if the client does not exist then reset client
    const clients = getState().clients.clients;
    if (!clients[id]) return dispatch(getDefaultClient());

    // get current information for client from server
    const client = getClient();
    const info = await client.getClientInfo(id, true);

    dispatch({
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
    const currentClient = await client.getDefault();
    dispatch(setCurrentClient(currentClient));
  };
}

function hydrateClients() {
  return async (dispatch, getState) => {
    try {
      await dispatch(getClients());
      let currentClient = getState().clients.currentClient;
      if (!currentClient.id) {
        const defaultClient = await dispatch(getDefaultClient());
        currentClient = defaultClient;
      }
      dispatch(getClients());
      dispatch(setCurrentClient(currentClient));
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
