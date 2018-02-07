import { Text } from 'bpanel-ui';

export const metadata = {
  name: 'address',
  sidebar: true,
  icon: 'bitcoin'
};

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      address: state.wallets.primary
        ? state.wallets.primary.receiveAddress
        : 'none'
    })
};

export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class DecoratedDashboard extends React.Component {
    static displayName() {
      return 'address';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array,
        address: PropTypes.string
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const pluginData = {
        name: metadata.name,
        Component: () =>
          React.createElement(
            Text,
            null,
            `Receive Address: ${this.props.address}`
          )
      };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(pluginData)}
        />
      );
    }
  };
};
