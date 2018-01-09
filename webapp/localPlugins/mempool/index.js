<<<<<<< HEAD
// Dashboard widget for showing mempool information

=======
>>>>>>> support for decorating dashboard plugin with a child plugin component
export const metadata = {
  name: 'mempool',
  author: 'bcoin-org'
};

<<<<<<< HEAD
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
=======
// very/exactly similar to normal decorators
// name should map exactly to the name of the target plugin to decorate
const decorateDashboard = (Plugin, { React, PropTypes }) => {
>>>>>>> support for decorating dashboard plugin with a child plugin component
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    static get displayName() {
      return 'mempoolWidget';
    }

    static get propTypes() {
      return {
<<<<<<< HEAD
        customChildren: PropTypes.array,
        mempoolSize: PropTypes.number,
        mempoolTx: PropTypes.number
=======
        customChildren: PropTypes.array
>>>>>>> support for decorating dashboard plugin with a child plugin component
      };
    }

    render() {
      const customChildren = (
        <div>
          <h5>Hello Mempool World</h5>
<<<<<<< HEAD
          <p>Mempool TX: {this.props.mempoolTx}</p>
          <p>Mempool Size: {this.props.mempoolSize}</p>
=======
>>>>>>> support for decorating dashboard plugin with a child plugin component
          {this.props.customChildren}
        </div>
      );

<<<<<<< HEAD
      return <Dashboard {...this.props} customChildren={customChildren} />;
=======
      return <Plugin {...this.props} customChildren={customChildren} />;
>>>>>>> support for decorating dashboard plugin with a child plugin component
    }
  };
};

// `decoratePlugin` passes an object with properties to map to the
// plugins they will decorate
export const decoratePlugin = { decorateDashboard };
