// Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
import HeaderPlugin from './Header';
/* END IMPORTS */

/* START EXPORTS */

export const metadata = {
  name: '@bpanel/bpanel-header',
  pathName: '',
  displayName: 'bPanel Header',
  author: 'bcoin-org',
  description: 'Default header for bpanel',
  version: require('../package.json').version
};

export const mapComponentState = {
  Header: (state, map) =>
    Object.assign(map, {
      bcoinUri: state.node.serverInfo.bcoinUri,
      loading: state.node.loading,
      network: state.node.node.network
    })
};

export const decorateHeader = (Header, { React, PropTypes }) => {
  return class extends React.PureComponent {
    static displayName() {
      return 'bPanelHeader';
    }

    static get propTypes() {
      return {
        theme: PropTypes.object,
        network: PropTypes.string,
        loading: PropTypes.bool,
        bcoinUri: PropTypes.string
      };
    }

    componentWillMount() {
      const { network, bcoinUri } = this.props;
      this.header = HeaderPlugin({
        statusIcon: 'ellipsis-h',
        bcoinUri,
        network
      });
    }

    componentWillUpdate({ loading, network, bcoinUri }) {
      const statusIcon = loading ? 'ellipsis-h' : 'check-circle';
      this.header = HeaderPlugin({
        statusIcon,
        bcoinUri,
        network
      });
    }

    render() {
      return <Header {...this.props} headerWidgets={this.header} />;
    }
  };
};
