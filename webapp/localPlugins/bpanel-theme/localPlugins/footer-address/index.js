import { Text } from 'bpanel-ui';

export const metadata = {
  name: 'footer-address',
  description: 'Display most recent wallet address in the footer',
  author: 'bcoin-org'
};

export const mapComponentState = {
  Footer: (state, map) =>
    Object.assign(map, { address: state.wallets.primary.receiveAddress })
};

export const decorateFooter = (Footer, { React, PropTypes }) => {
  return class extends React.PureComponent {
    static displayName() {
      return 'bpanelAddressFooter';
    }

    static get propTypes() {
      return {
        address: PropTypes.string,
        customChildren: PropTypes.node
      };
    }

    render() {
      const { address, customChildren: existingCustomChildren } = this.props;
      let customChildren = existingCustomChildren;
      if (address) {
        customChildren = (
          <div>
            {existingCustomChildren}
            <Text>Receive Address: {address}</Text>
          </div>
        );
      }
      return <Footer {...this.props} customChildren={customChildren} />;
    }
  };
};
