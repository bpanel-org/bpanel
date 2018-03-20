import { chain } from 'underscore';
import { createSelector } from 'reselect';

// const getPeersFromState = ({ node: nodeState }) =>
//   nodeState.peers ? nodeState.peers : [];

const getPeers = (peers = []) => peers;

export const getPeerCoordinates = async peers => {
  const getCoordsPromises = peers.map(async ({ addr, id }) => {
    const ip = addr.split(':').slice(0, 1);
    const response = await fetch(`http://freegeoip.net/json/${ip}`);
    const location = await response.json();
    const { latitude, longitude } = location;
    return { latitude, longitude, id };
  });

  return await Promise.all(getCoordsPromises);
};

const pickTableData = peers =>
  peers.map(peer =>
    chain(peer)
      .pick((value, key) => {
        const keys = ['id', 'name', 'addr', 'subver', 'inbound', 'relaytxes'];
        if (keys.indexOf(key) > -1) return true;
      })
      .mapObject(value => {
        // for boolean values need to convert to a string
        if (typeof value === 'boolean') return value.toString();
        return value;
      })
      .value()
  );

const peerCoordinates = createSelector([getPeers], getPeerCoordinates);

const peerTableData = createSelector([getPeers], pickTableData);

export default { peerCoordinates, peerTableData };
