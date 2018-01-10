// Dashboard widget for showing mempool information

export const metadata = {
  name: 'mempool',
  author: 'bcoin-org'
};

export const mapPanelState = (state, map) =>
  Object.assign(map, {
    mempoolTx: state.node.mempool.tx,
    mempoolSize: state.node.mempool.size
  });

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
          <h5>Hello Mempool World</h5>
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
