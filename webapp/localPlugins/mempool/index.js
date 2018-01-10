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

// very/exactly similar to normal decorators
// name should map exactly to the name of the target plugin to decorate
const decorateDashboard = (Dashboard, { React, PropTypes }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    static get displayName() {
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
export const decoratePlugin = { decorateDashboard };
