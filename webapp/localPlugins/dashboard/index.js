import Dashboard from './Dashboard';

export const metadata = {
  name: 'dashboard',
  path: '',
  author: 'bcoin-org',
  order: 0,
  icon: 'home',
  parent: ''
};

export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class DecoratedDashboard extends React.Component {
    static displayName() {
      return 'bPanel Dashboard';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.oneOf([PropTypes.element, PropTypes.object])
      };
    }

    render() {
      const extendedChildren = (
        <div>
          {this.props.customChildren}
          <Dashboard />
        </div>
      );

      return <Panel {...this.props} customChildren={extendedChildren} />;
    }
  };
};

module.exports = { metadata, decoratePanel };
