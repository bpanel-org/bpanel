export const metadata = {
  name: 'mempool',
  author: 'bcoin-org'
};

// very/exactly similar to normal decorators
// name should map exactly to the name of the target plugin to decorate
const decorateDashboard = (Plugin, { React, PropTypes }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    static get displayName() {
      return 'mempoolWidget';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array
      };
    }

    render() {
      const customChildren = (
        <div>
          <h5>Hello Mempool World</h5>
          {this.props.customChildren}
        </div>
      );

      return <Plugin {...this.props} customChildren={customChildren} />;
    }
  };
};

// `decoratePlugin` passes an object with properties to map to the
// plugins they will decorate
export const decoratePlugin = { decorateDashboard };
