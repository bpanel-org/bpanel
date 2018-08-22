import { getClient } from '@bpanel/bpanel-utils';

import { SET_DEFAULT_CLIENT, HYDRATE_CLIENTS } from '../constants/clients';

const bpClient = getClient();

function hydrateClients(clients) {
  return {
    type: HYDRATE_CLIENTS,
    payload: clients
  };
}

export function setDefaultClient(id) {
  return {
    type: SET_DEFAULT_CLIENT,
    payload: id
  };
}

export function getClients() {
  return async dispatch => {
    try {
      const clients = await bpClient.getClients();
      dispatch(hydrateClients(clients));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('error:', e);
    }
  };
}

export default {
  getClients
};
