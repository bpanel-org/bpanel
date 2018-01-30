import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Text, Header, SidebarNavItem } from 'bpanel-ui';

import { pluginMetaProps } from '../../containers/App/App';

class Sidebar extends PureComponent {
  static get propTypes() {
    return {
      theme: PropTypes.object,
      beforeNav: PropTypes.array,
      afterNav: PropTypes.array,
      sidebarNavItems: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.node,
          PropTypes.shape({
            ...pluginMetaProps,
            subItems: PropTypes.arrayOf(
              PropTypes.oneOfType([
                PropTypes.node,
                PropTypes.shape(pluginMetaProps)
              ])
            )
          })
        ])
      ),
      location: PropTypes.shape({
        pathname: PropTypes.string
      })
    };
  }

  renderLogo() {
    const { theme } = this.props;
    return (
      <Link to="/">
        <div style={theme.sidebar.logo.container}>
          <img
            src={theme.sidebar.logo.img.url}
            style={theme.sidebar.logo.img}
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

  renderSidebarItems() {
    const { sidebarNavItems, location: { pathname = '' }, theme } = this.props;
    return sidebarNavItems
      .filter(plugin => plugin.sidebar || React.isValidElement(plugin))
      .map((plugin, index) => {
        // filter will first remove any plugins w/o sidebar property set to true
        // mapping through each parent item to create the sidebar nav element
        const sidebarItemProps = { ...plugin, theme, pathname };
        if (plugin.subItems) {
          // if this sidebar item has sub items
          // then we need to create and append the children elements
          sidebarItemProps.children = plugin.subItems.map(
            (subItem, subIndex) => {
              const props = {
                ...subItem,
                subItem: true,
                pathname,
                theme,
                key: `${index}-${subIndex}`
              };
              return this.renderNavItem(plugin, props);
            }
          );
        }
        return this.renderNavItem(plugin, { ...sidebarItemProps, key: index });
      });
  }

  renderFooter() {
    const { theme } = this.props;
    const commitHash = process.env.__COMMIT__.slice(0, 7);
    const version = process.env.__VERSION__;
    return (
      <div className="mt-auto text-center" style={theme.sidebar.footer}>
        <Header type="h5">bpanel</Header>
        <Text
          type="p"
          className="version text-truncate"
          style={theme.sidebar.footerText}
        >
          bcoin: {version}
        </Text>
        <Text
          type="p"
          className="commit text-truncate"
          style={theme.sidebar.footerText}
        >
          UI: {commitHash}
        </Text>
      </div>
    );
  }

  render() {
    const { theme, beforeNav, afterNav } = this.props;
    return (
      <nav
        className="d-flex flex-column navbar navbar-default navbar-fixed-side"
        style={theme.sidebar.container}
      >
        {this.renderLogo()}
        {beforeNav}
        {this.renderSidebarItems()}
        {afterNav}
        {this.renderFooter()}
      </nav>
    );
  }
}

export default Sidebar;
