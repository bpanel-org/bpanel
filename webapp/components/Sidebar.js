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
      }),
      match: PropTypes.shape({
        isExact: PropTypes.bool,
        path: PropTypes.string,
        url: PropTypes.string,
        params: PropTypes.object
      }).isRequired
    };
  }

  renderLogo() {
    const {
      theme,
      match: { url }
    } = this.props;
    return (
      <Link to="/">
        <div className={theme.sidebar.logoContainer}>
          <img
            src={`${url}${theme.logoUrl}`}
            className={theme.sidebar.logoImg}
          />
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

  getPathName(itemProps) {
    return itemProps.pathName ? itemProps.pathName : itemProps.name;
  }

  renderSidebarItems() {
    const {
      sidebarNavItems,
      location: { pathname = '' },
      match,
      theme
    } = this.props;
    return (
      sidebarNavItems
        // filter out any plugins w/o sidebar or nav property set to true
        // or that is not a valid react element (custom sidebar components)
        .filter(
          plugin => plugin.sidebar || plugin.nav || React.isValidElement(plugin)
        )
        // map through each parent item to create the sidebar nav element
        .map((plugin, index) => {
          // for a nav item that is already a react element
          // we need to retrieve the props
          const pluginProps = plugin.props ? plugin.props : {};
          const sidebarItemProps = {
            ...plugin,
            theme,
            match,
            pathname,
            ...pluginProps
          };
          sidebarItemProps.pathName = this.getPathName(sidebarItemProps);
          if (plugin.parent) {
            // if this sidebar item is a child then add appropriate props
            sidebarItemProps.subItem = true;
          }
          return this.renderNavItem(plugin, {
            ...sidebarItemProps,
            key: index
          });
        })
    );
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
