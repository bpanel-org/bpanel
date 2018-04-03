import { Text, widgetCreator } from '@bpanel/bpanel-ui';

export const metadata = {
  name: 'footer-address',
  description: 'Display most recent wallet address in the footer',
  author: 'bcoin-org'
};

export const mapComponentState = {
  Footer: (state, map) => Object.assign(map, { wallets: state.wallets })
};

export const decorateFooter = (Footer, { React, PropTypes }) => {
  return class extends React.PureComponent {
    static displayName() {
      return 'bpanelAddressFooter';
    }

    static get propTypes() {
      return {
        wallets: PropTypes.object,
        footerWidgets: PropTypes.arrayOf(PropTypes.func)
      };
    }

    render() {
      const { wallets, footerWidgets = [] } = this.props;

      const address = wallets.primary ? wallets.primary.receiveAddress : '...';
      if (address) {
        const FooterAddress = ({ address }) => (
          <div className="col-6 text-truncate">
            <Text type="span">Receive Address: {address}</Text>
          </div>
        );
        footerWidgets.push(widgetCreator(FooterAddress)({ address }));
      }
      return <Footer {...this.props} footerWidgets={footerWidgets} />;
    }
  };
};
