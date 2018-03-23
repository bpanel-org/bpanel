import { Text, utils } from '@bpanel/bpanel-ui';
import React from 'react';

const { connectTheme } = utils;

export const metadata = {
  name: 'bpanel-header',
  author: 'bcoin-org'
};

export const mapComponentState = {
  Header: (state, map) =>
    Object.assign(map, {
      bcoinUri: state.node.serverInfo.bcoinUri,
      loading: state.node.loading,
      network: state.node.node.network
    })
};
const CustomHeader = ({
  customChildren: existingCustomChildren,
  statusIcon,
  network,
  bcoinUri,
  theme
}) => (
  <div className="container">
    {existingCustomChildren}
    <div
      className={`${theme.headerbar.networkStatus} ml-md-auto text-right col`}
    >
      <div className="network text-uppercase">
        <Text className={theme.headerbar.text}>Status: {network} </Text>
        <i
          className={`${theme.headerbar.icon} fa fa-${statusIcon}`}
          areahidden="true"
        />
      </div>
      <div className="node">
        <Text className={`${theme.headerbar.nodeText} ${theme.headerbar.text}`}>
          Node:{' '}
        </Text>
        <Text className={`${theme.headerbar.text}`}>{bcoinUri}</Text>
      </div>
    </div>
  </div>
);

const ThemedHeader = connectTheme(CustomHeader);

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
        bcoinUri
      } = this.props;

      const statusIcon = loading ? 'ellipsis-h' : 'check-circle';
      const customChildren = React.createElement(ThemedHeader, {
        customChildren: existingCustomChildren,
        statusIcon,
        bcoinUri,
        network
      });
      return <Header {...this.props} customChildren={customChildren} />;
    }
  };
};
