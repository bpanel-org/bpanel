import Wallet from './Wallet';
import { SOCKET_CONNECTED, ON_WALLET_TX } from './constants';
import { joinWallet, watchTX } from './actions';

export const metadata = {
  name: 'wallets',
  author: 'bcoin-org',
  order: 3,
  icon: 'hdd-o',
  sidebar: true,
  parent: ''
};

export const addSocketConstants = (sockets = { listeners: [] }) =>
  Object.assign(sockets, {
    socketListeners: sockets.listeners.push({
      event: 'wallet tx',
      actionType: ON_WALLET_TX
    })
  });

export const middleware = ({ dispatch }) => next => action => {
  const { type, payload } = action;
  if (type === SOCKET_CONNECTED) {
    dispatch(joinWallet());
    dispatch(watchTX());
  } else if (type === ON_WALLET_TX) {
    console.log('got a wallet tx!! ', payload);
  }
  return next(action);
};

export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class DecoratedWallet extends React.Component {
    static displayName() {
      return 'bPanel Wallet';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const pluginData = {
        name: metadata.name,
        Component: Wallet
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
