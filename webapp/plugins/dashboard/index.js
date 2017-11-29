import Dashboard from './Dashboard';

export const metadata = {
  name: 'dashboard',
  author: 'bcoin-org',
  order: 0,
  icon: 'home'
};

export function decorateUI(Pane, { React, PropTypes }) {
  class DecoratedDashboard extends React.Component {
    render() {
      const { customChildren } = this.props;
      const existingChildren = customChildren
        ? customChildren.isArray() ? customChildren : [customChildren]
        : [];
      existingChildren.concat(Dashboard);

      return React.createElement(
        Pane,
        Object.assign({}, this.props, existingChildren)
      );
    }
  }

  DecoratedDashboard.propTypes = {
    customChildren: PropTypes.arrayOf(PropTypes.node)
  };

  return DecoratedDashboard;
}
