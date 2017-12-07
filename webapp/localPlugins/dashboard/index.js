import Dashboard from './Dashboard';

export const metadata = {
  name: 'dashboard',
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
        customChildren: PropTypes.array
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const pluginData = {
        name: metadata.name,
        Component: Dashboard
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
