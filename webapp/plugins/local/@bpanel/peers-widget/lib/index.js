// Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
import { Header } from '@bpanel/bpanel-ui';
import { bpanelClient } from '@bpanel/bpanel-utils';
import { chain } from 'underscore';

import modules from './plugins';
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

const decorateDashboard = (Dashboard, { React, PropTypes }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.client = bpanelClient();
      this.state = {
        peers: []
      };
    }

    static get displayName() {
      return 'Peers Widgets';
    }

    static get propTypes() {
      return {
        bottomWidgets: PropTypes.array,
        customChildrenAfter: PropTypes.node
      };
    }

    async componentDidMount() {
      this._isMounted = true;
      const peersList = await this.client.execute('getpeerinfo');
      const peers = peersList.map(peer =>
        chain(peer)
          .pick((value, key) => {
            const keys = [
              'id',
              'addr',
              'name',
              'subver',
              'inbound',
              'relaytxes'
            ];
            if (keys.indexOf(key) > -1) return true;
          })
          .mapObject(value => {
            // for boolean values need to convert to a string
            if (typeof value === 'boolean') return value.toString();
            return value;
          })
          .value()
      );
      this.setState({ peers });
    }

    render() {
      const { peers } = this.state;
      const { bottomWidgets = [] } = this.props;
      // widget to display table of peers
      const Peers = () => (
        <div className="col-lg-8">
          <Header type="h5">Peers List</Header>
          <PeersList peers={peers} />
        </div>
      );
      bottomWidgets.push(Peers);

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
