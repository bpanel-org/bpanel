import { bpanelClient } from '@bpanel/bpanel-utils';
const client = bpanelClient();

function setPeers(peers) {
  return {
    type: 'SET_PEERS',
    payload: peers
  };
}

export function getPeers() {
  return async dispatch => {
    const peersList = await client.execute('getpeerinfo');
    dispatch(setPeers(peersList));
  };
}
