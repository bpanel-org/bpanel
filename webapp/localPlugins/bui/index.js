import { components } from 'bpanel-ui';

import Bui from './Bui';

const { SidebarNavItem } = components;

export const metadata = {
  name: 'ui',
  author: 'bcoin-org',
  order: 0,
  icon: 'cubes',
  parent: ''
};

export const decorateSidebar = (Sidebar, { React, PropTypes }) => {
  return class extends React.PureComponent {
    static displayName() {
      return 'testSidebar';
    }

    static get propTypes() {
      return {
        afterNav: PropTypes.array,
        sidebarItems: PropTypes.array,
        location: PropTypes.shape({
          pathname: PropTypes.string
        })
      };
    }

    render() {
      const {
        sidebarItems: existingNavItems,
        location: { pathname = '' }
      } = this.props;

      let pluginIndex = existingNavItems.length;

      // app will order the nav items for us
      // want to find out what index it is at
      // so it can be replaced with our custom nav component
      // can also just append to end
      for (let i = 0; i < existingNavItems.length; i++) {
        if (existingNavItems[i].name === metadata.name) {
          pluginIndex = i;
        }
      }

      const newNavItem = React.createElement(SidebarNavItem, {
        name: metadata.name.toUpperCase(),
        icon: 'cubes',
        pathname
      });

      const sidebarItems = existingNavItems
        .slice(0, pluginIndex)
        .concat(newNavItem, existingNavItems.slice(pluginIndex + 1));

      return <Sidebar {...this.props} sidebarItems={sidebarItems} />;
    }
  };
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
