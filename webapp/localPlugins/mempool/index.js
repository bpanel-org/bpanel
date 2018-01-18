// Dashboard widget for showing mempool information

import { components } from 'bpanel-ui';
// eslint-disable-next-line import/no-unresolved
import { api } from 'bpanel/utils';

import { UPDATE_MEMPOOL, MEMPOOL_TX, SOCKET_CONNECTED } from './constants';
import { broadcastSetFilter, subscribeTX, watchMempool } from './actions';

const { Header, Button } = components;

export const metadata = {
  name: 'mempool',
  author: 'bcoin-org'
};

export const mapPanelState = (state, map) =>
  Object.assign(map, {
    mempoolTx: state.node.mempool.tx,
    mempoolSize: state.node.mempool.size
  });

export const addSocketsConstants = (sockets = {}) =>
  Object.assign(sockets, {
    socketListeners: sockets.listeners.push(
      {
        event: 'update mempool',
        actionType: UPDATE_MEMPOOL
      },
      {
        event: 'mempool tx',
        actionType: MEMPOOL_TX
      }
    )
  });

export const reduceNode = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_MEMPOOL: {
      const { tx, size } = payload;
      const currentTx = state.getIn('tx');
      const currentSize = state.getIn('size');

      if (tx !== currentTx && size !== currentSize) {
        return state.set('mempool', payload);
      }
      break;
    }

    default:
      return state;
  }
};

export const getRouteProps = {
  dashboard: (parentProps, props) =>
    Object.assign(props, {
      mempoolTx: parentProps.mempoolTx,
      mempoolSize: parentProps.mempoolSize
    })
};

export const middleware = ({ dispatch }) => next => async action => {
  const { type } = action;
  if (type === SOCKET_CONNECTED) {
    // actions to dispatch when the socket has connected
    // these are broadcasts and subscriptions we want to make
    // to the bcoin node
    dispatch(watchMempool());
    dispatch(broadcastSetFilter());
    dispatch(subscribeTX());
    return next(action);
  } else if (type === MEMPOOL_TX) {
    const response = await fetch(api.get.info());
    const { mempool } = await response.json();
    return dispatch({
      type: UPDATE_MEMPOOL,
      payload: mempool
    });
  }
  return next(action);
};

// very/exactly similar to normal decorators
// name should map exactly to the name of the target plugin to decorate
const decorateDashboard = (Dashboard, { React, PropTypes }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    static displayName() {
      return 'mempoolWidget';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array,
        mempoolSize: PropTypes.number,
        mempoolTx: PropTypes.number
      };
    }

    justKidding() {
      alert('Just Kidding!');
    }

    render() {
      const customChildren = (
        <div>
          <Header type="h5"> Current Mempool</Header>
          <p>Mempool TX: {this.props.mempoolTx}</p>
          <p>Mempool Size: {this.props.mempoolSize}</p>
          <Button onClick={() => this.justKidding()}>
            Make Transactions Cheaper
          </Button>
          {this.props.customChildren}
        </div>
      );

      return <Dashboard {...this.props} customChildren={customChildren} />;
    }
  };
};

// `decoratePlugin` passes an object with properties to map to the
// plugins they will decorate
export const decoratePlugin = { dashboard: decorateDashboard };
