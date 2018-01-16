import React from 'react';
import { components, utils } from 'bpanel-ui';

const { Button, Header, SidebarNavItem } = components;

export const metadata = {
  name: 'test',
  author: 'bcoin-org',
  order: 1
};

const Test = () => (
  <div>
    <Header type="h3">Hello This is A Test</Header>
  </div>
);

const ThemedTest = utils.connectTheme(Test);

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
        afterNav: existingAfterNav,
        sidebarItems: existingNavItems,
        location: { pathname = '' }
      } = this.props;

      let _customChildren = existingAfterNav
        ? existingAfterNav instanceof Array
          ? existingAfterNav
          : [existingAfterNav]
        : [];

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
        name: metadata.name,
        icon: 'pied-piper-alt',
        subItem: true,
        pathname
      });

      const sidebarItems = existingNavItems
        .slice(0, pluginIndex)
        .concat(newNavItem, existingNavItems.slice(pluginIndex + 1));

      _customChildren = [].concat(
        _customChildren,
        React.createElement(
          Button,
          {
            key: _customChildren.length
          },
          'Fun Test Button'
        )
      );

      return (
        <Sidebar
          {...this.props}
          afterNav={_customChildren}
          sidebarItems={sidebarItems}
        />
      );
    }
  };
};

export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return 'testComponent';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const routeData = {
        name: metadata.name,
        Component: ThemedTest
      };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(routeData)}
        />
      );
    }
  };
};
