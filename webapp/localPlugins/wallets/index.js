import Wallet from './Wallet';
import { SOCKET_CONNECTED, WALLET_TX, ADD_WALLET_TX } from './constants';
import { joinWallet, leaveWallet, watchTX, addWalletTX } from './actions';

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
      actionType: WALLET_TX
    })
  });

export const mapComponentDispatch = {
  Panel: (dispatch, map) =>
    Object.assign(map, {
      joinWallet: (id, token) => dispatch(joinWallet(id, token)),
      leaveWallet: id => dispatch(leaveWallet(id))
    })
};

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      wallets: state.wallets
    })
};

export const getRouteProps = {
  wallets: (parentProps, props) =>
    Object.assign(props, {
      joinWallet: parentProps.joinWallet,
      leaveWallet: parentProps.leaveWallet,
      wallets: parentProps.wallets
    })
};

export const reduceWallets = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_WALLET_TX: {
      const { id, tx } = payload;
      const transactions = state[id].transactions
        ? state[id].transactions.asMutable()
        : [];
      transactions.push(tx);
      return state.setIn([id, 'transactions'], transactions);
    }

    default:
      return state;
  }
};

export const middleware = ({ dispatch }) => next => action => {
  const { type, payload } = action;
  if (type === SOCKET_CONNECTED) {
    dispatch(watchTX());
  } else if (type === WALLET_TX) {
    dispatch(addWalletTX(...payload));
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
