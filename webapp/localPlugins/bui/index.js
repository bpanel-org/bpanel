import Bui from './Bui';

export const metadata = {
  name: 'ui',
  author: 'bcoin-org',
  order: 0,
  icon: 'cubes',
  parent: ''
};

export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class DecoratedDashboard extends React.Component {
    static displayName() {
      return 'bPanel UI';
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
        Component: Bui
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
