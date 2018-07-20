import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Header, SidebarNavItem } from '@bpanel/bpanel-ui';
import { Link } from 'react-router-dom';

import { pluginMetadata } from '../store/propTypes';

const { sortedMetadataPropTypes } = pluginMetadata;

try {
  var { version, commit } = require('../version.json');
} catch (e) {}

class Sidebar extends PureComponent {
  static get propTypes() {
    return {
      theme: PropTypes.object,
      beforeNav: PropTypes.array,
      afterNav: PropTypes.array,
      sidebarNavItems: sortedMetadataPropTypes,
      customSidebarHeader: PropTypes.node,
      customSidebarFooter: PropTypes.node,
      location: PropTypes.shape({
        pathname: PropTypes.string
      })
    };
  }

  renderLogo() {
    const { theme } = this.props;
    return (
      <Link to="/">
        <div className={theme.sidebar.logoContainer}>
          <img src={theme.logoUrl} className={theme.sidebar.logoImg} />
        </div>
      </Link>
    );
  }

  renderNavItem(plugin, props) {
    if (React.isValidElement(plugin)) {
      // If it is already a react element created by decorator
      // in the plugin, then extend with updated props and key
      return React.cloneElement(plugin, props);
    }

    return React.createElement(SidebarNavItem, props);
  }

  renderSidebarItems() {
    const {
      sidebarNavItems,
      location: { pathname = '' },
      theme
    } = this.props;
    return sidebarNavItems
      .filter(plugin => plugin.sidebar || React.isValidElement(plugin))
      .map((plugin, index) => {
        // filter will first remove any plugins w/o sidebar property set to true
        // mapping through each parent item to create the sidebar nav element
        const sidebarItemProps = { ...plugin, theme, pathname };
        if (plugin.parent) {
          // const parentIndex = sidebarNavItems.findIndex(
          //   item => (item.name = plugin.parent)
          // );
          // const parent = sidebarNavItems[parentIndex];

          // if this sidebar item is a child then add appropriate props
          // const parentPath = parent.pathName ? parent.pathName : parent.name;
          // const pathName = sidebarItemProps.pathName
          //   ? `${parentPath}/${sidebarItemProps.pathName}`
          //   : `${parentPath}/${sidebarItemProps.name}`;
          const pathName = sidebarItemProps.pathName
            ? sidebarItemProps.pathName
            : sidebarItemProps.name;
          sidebarItemProps.pathName = pathName;
          sidebarItemProps.subItem = true;
        }
        return this.renderNavItem(plugin, { ...sidebarItemProps, key: index });
      });
  }

  renderFooter() {
    const { theme } = this.props;
    const commitHash = (commit || '').slice(0, 7);
    return (
      <div className={`${theme.sidebar.footer} mt-auto text-center`}>
        <Header type="h5">bPanel</Header>
        <Text
          type="p"
          className={`${theme.sidebar.footerText} version text-truncate`}
        >
          bpanel: {version}
        </Text>
        <Text
          type="p"
          className={`${theme.sidebar.footerText} commit text-truncate`}
        >
          UI: {commitHash}
        </Text>
      </div>
    );
  }

  render() {
    const {
      theme,
      beforeNav,
      afterNav,
      customSidebarHeader,
      customSidebarFooter
    } = this.props;
    return (
      <nav
        className={`${
          theme.sidebar.container
        } d-flex flex-column navbar navbar-default navbar-fixed-side`}
      >
        {customSidebarHeader ? customSidebarHeader : this.renderLogo()}
        {beforeNav}
        {this.renderSidebarItems()}
        {afterNav}
        {customSidebarFooter ? customSidebarFooter : this.renderFooter()}
      </nav>
    );
  }
}

export default Sidebar;
