// Dashboard widget for showing mempool information
import { UPDATE_MEMPOOL } from './constants';

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
    socketListeners: sockets.listeners.push({
      event: 'update mempool',
      actionType: UPDATE_MEMPOOL
    })
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

function watchMempool() {
  return {
    type: 'EMIT_SOCKET',
    bsock: {
      type: 'broadcast',
      message: 'watch mempool'
    }
  };
}

function broadcastSetFilter() {
  // need to set a filter for the socket to get mempool updates
  // all zeros means an open filter
  return {
    type: 'EMIT_SOCKET',
    bsock: {
      type: 'broadcast',
      message: 'set filter',
      filter: '00000000000000000000'
    }
  };
}

export const middleware = ({ dispatch }) => next => action => {
  const { type } = action;

  if (type === 'SOCKET_CONNECTED') {
    dispatch(watchMempool());
    dispatch(broadcastSetFilter());
  }
  next(action);
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

    render() {
      const customChildren = (
        <div>
          <h5>Current Mempool</h5>
          <p>Mempool TX: {this.props.mempoolTx}</p>
          <p>Mempool Size: {this.props.mempoolSize}</p>
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
