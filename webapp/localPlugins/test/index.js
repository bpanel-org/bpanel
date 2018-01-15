import React from 'react';
import { components, utils } from 'bpanel-ui';

const { Button, Header, SidebarNavItem } = components;

export const metadata = {
  name: 'test',
  author: 'bcoin-org'
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
        customChildren: PropTypes.array,
        sidebarNavItems: PropTypes.array,
        location: PropTypes.shape({
          pathname: PropTypes.string
        })
      };
    }

    render() {
      const {
        customChildren: existingInnerChildren,
        sidebarNavItems: existingNavItems,
        location: { pathname = '' }
      } = this.props;

      let _customChildren = existingInnerChildren
        ? existingInnerChildren instanceof Array
          ? existingInnerChildren
          : [existingInnerChildren]
        : [];

      let navItems = existingNavItems
        ? existingNavItems instanceof Array
          ? existingNavItems
          : [existingNavItems]
        : [];

      navItems = [].concat(
        navItems,
        React.createElement(SidebarNavItem, {
          name: metadata.name,
          icon: 'pied-piper-alt',
          pathname
        })
      );

      _customChildren = [].concat(
        _customChildren,
        React.createElement(Button, null, 'Fun Test Button')
      );
      return (
        <Sidebar
          {...this.props}
          customChildren={_customChildren}
          sidebarNavItems={navItems}
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
