import { BPClient } from '@bpanel/bpanel-utils';

import { HYDRATE_CLIENTS } from '../constants/clients';

function options() {
  // bpanel endpoints
  const nodePath = '/bcoin';
  const walletPath = '/bwallet';
  // determine the port and ssl usage
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  let port = window.location.port;
  let ssl = false;
  // use https and http ports when the window doesn't render them
  if (port === '') protocol === 'https:' ? (port = '443') : (port = '80');
  if (protocol === 'https:') ssl = true;
  return {
    bpanelPort: parseInt(port, 10),
    ssl,
    hostname,
    nodePath,
    walletPath
  };
}

const { bpanelPort, hostname, ssl } = options();

export function getClients() {
  return async dispatch => {
    const bpClient = new BPClient({ port: bpanelPort, host: hostname, ssl });
    try {
      const clients = await bpClient.getClients();
      console.log('clients:', clients);
      dispatch({
        type: HYDRATE_CLIENTS,
        payload: clients
      });
    } catch (e) {
      console.error('error:', e);
    }
  };
}

export default {
  getClients
};
