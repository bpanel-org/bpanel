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
    constructor(props) {
      super(props);
      this.address = '...';
    }
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

      if (wallets.accountInfo && wallets.accountInfo.primary) {
        this.address = wallets.accountInfo.primary.default.receiveAddress;
      }

      const FooterAddress = ({ address }) => (
        <div className="col-6 text-truncate">
          <Text type="span">Receive Address: {address}</Text>
        </div>
      );
      footerWidgets.push(
        widgetCreator(FooterAddress)({ address: this.address })
      );

      return <Footer {...this.props} footerWidgets={footerWidgets} />;
    }
  };
};
