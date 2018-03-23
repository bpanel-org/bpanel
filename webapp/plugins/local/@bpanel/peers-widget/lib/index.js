// Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
import assert from 'assert';

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
  return class extends React.Component {
    constructor(props) {
      super(props);
      const { peers } = props;
      // These components are created with widgetCreator
      // which allows you to append widgets to another plugin without
      // causing full re-renders anytime other props change
      // in the parent plugin. You'll need to update these when
      // your target props change (in this case peers).
      // See componentDidUpdate for example
      this.peersList = PeersList({ peers });
      this.peersMap = PeersMap({ peers });
    }

    static get displayName() {
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
    }

    componentWillUpdate({ peers: nextPeers }) {
      const { peers } = this.props;
      // if (peers.length > 0 && peers[0] !== prevPeers[0]) {
      if (!peers.length && nextPeers.length) {
        this.peersList = PeersList({ peers: nextPeers });
        this.peersMap = PeersMap({ peers: nextPeers });
      }
    }

    render() {
      const { bottomWidgets = [], customChildrenAfter = [] } = this.props;
      // widget to display table of peers
      bottomWidgets.push(this.peersList);

      // Widget for displaying a map with the peer locations
      customChildrenAfter.push(this.peersMap);

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
