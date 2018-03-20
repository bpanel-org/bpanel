// Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
import assert from 'assert';
import { Header, Text } from '@bpanel/bpanel-ui';
import { bpanelClient } from '@bpanel/bpanel-utils';

import modules from './plugins';
import { getPeers } from './actions';
import { SET_PEERS } from './constants';
import PeersList from './components/PeersList';
import PeersMap from './components/PeersMap';
/* END IMPORTS */

const plugins = Object.keys(modules).map(name => modules[name]);
/* START EXPORTS */

export const metadata = {
  name: '@bpanel/peers-widget',
  pathName: '',
  displayName: 'Peers',
  author: 'bcoin-org',
  description:
    'A widget for displaying peer information on the bPanel Dashboard',
  version: require('../package.json').version
};

export const pluginConfig = { plugins };

export const reduceNode = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PEERS: {
      assert(Array.isArray(payload), 'Payload for SET_PEERS must be array');
      return state.set('peers', payload);
    }

    default:
      return state;
  }
};

export const getRouteProps = {
  '@bpanel/dashboard': (parentProps, props) =>
    Object.assign(props, {
      peers: parentProps.peers,
      getPeers: parentProps.getPeers
    })
};

export const mapComponentDispatch = {
  Panel: (dispatch, map) =>
    Object.assign(map, {
      getPeers: () => dispatch(getPeers())
    })
};

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      peers: state.node.peers
    })
};

const decorateDashboard = (Dashboard, { React, PropTypes }) => {
  // This way of creating the widgets is to help avoid re-renders
  // if another widget has props/state update
  const PeerListCreator = (peers = []) =>
    class extends React.PureComponent {
      static displayName() {
        return 'Peers List';
      }

      render() {
        let peerList;
        if (peers.length > 0) {
          peerList = <PeersList peers={peers} />;
        } else {
          <Text type="p">Loading Peers...</Text>;
        }
        return (
          <div className="col-lg-8">
            <Header type="h5">Peers List</Header>
            {peerList}
          </div>
        );
      }
    };

  return class extends React.Component {
    constructor(props) {
      super(props);
      this.client = bpanelClient();
      this.peersList = PeerListCreator();
    }

    static displayName() {
      return 'Peers Widgets';
    }

    static get defaultProps() {
      return {
        peers: []
      };
    }

    static get propTypes() {
      return {
        bottomWidgets: PropTypes.array,
        customChildrenAfter: PropTypes.node,
        peers: PropTypes.arrayOf(PropTypes.object),
        getPeers: PropTypes.func.isRequired
      };
    }

    componentDidMount() {
      this.props.getPeers();
      this.peersList = PeerListCreator(this.props.peers);
    }

    componentWillUpdate({ peers }) {
      if (peers.length > 0 && peers[0] !== this.props.peers[0])
        this.peersList = PeerListCreator(peers);
    }

    render() {
      const { bottomWidgets = [], peers } = this.props;
      // widget to display table of peers
      bottomWidgets.push(this.peersList);

      // Widget for displaying a map with the peer locations
      const customChildrenAfter = (
        <div className="col" style={{ height: '500px', width: '100%' }}>
          <PeersMap peers={peers} />
          {this.props.customChildrenAfter}
        </div>
      );

      return (
        <Dashboard
          {...this.props}
          bottomWidgets={bottomWidgets}
          customChildrenAfter={customChildrenAfter}
        />
      );
    }
  };
};

// `decoratePlugin` passes an object with properties to map to the
// plugins they will decorate. Must match target plugin name exactly
export const decoratePlugin = { '@bpanel/dashboard': decorateDashboard };

/* END EXPORTS */
