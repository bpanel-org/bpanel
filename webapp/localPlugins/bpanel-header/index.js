import { Text } from 'bpanel-ui';

export const metadata = {
  name: 'bpanel-header',
  author: 'bcoin-org'
};

export const mapComponentState = {
  Header: (state, map) =>
    Object.assign(map, {
      bcoinUri: state.node.serverInfo.bcoinUri,
      loading: state.node.loading,
      nodeInfo: state.node.node.network
    })
};

export const decorateHeader = (Header, { React, PropTypes }) => {
  return class extends React.PureComponent {
    static displayName() {
      return 'bPanelHeader';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.node,
        theme: PropTypes.object,
        network: PropTypes.string,
        loading: PropTypes.bool,
        bcoinUri: PropTypes.string
      };
    }

    render() {
      const {
        customChildren: existingCustomChildren,
        loading,
        network,
        bcoinUri,
        theme
      } = this.props;

      const statusIcon = loading ? 'ellipsis-h' : 'check-circle';

      const customChildren = (
        <div className="container">
          {existingCustomChildren}
          <div
            className="ml-md-auto text-right col"
            style={theme.headerbar.networkStatus}
          >
            <div className="network text-uppercase">
              <Text style={theme.headerbar.text}>Status: {network} </Text>
              <i
                className={`fa fa-${statusIcon}`}
                areahidden="true"
                style={theme.headerbar.icon}
              />
            </div>
            <div className="node">
              <Text
                style={{ ...theme.headerbar.nodeText, ...theme.headerbar.text }}
              >
                Node:{' '}
              </Text>
              <Text style={theme.headerbar.text}>{bcoinUri}</Text>
            </div>
          </div>
        </div>
      );

      return <Header {...this.props} customChildren={customChildren} />;
    }
  };
};
