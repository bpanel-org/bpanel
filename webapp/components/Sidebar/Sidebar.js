import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as UI from 'bpanel-ui';

import { pluginMetaProps } from '../../containers/App/App';
import SidebarItem from './SidebarItem';
import logo from '../../assets/logo.png';

const { components: { Text, Header }, utils: { connectTheme } } = UI;

class Sidebar extends PureComponent {
  static get propTypes() {
    return {
      theme: PropTypes.object,
      sidebarItems: PropTypes.arrayOf(
        PropTypes.shape({
          ...pluginMetaProps,
          subItems: PropTypes.arrayOf(PropTypes.shape(pluginMetaProps))
        })
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
          <img src={logo} style={theme.sidebar.logo.img} />
        </div>
      </Link>
    );
  }

  renderSidebarItems() {
    const { sidebarItems, location: { pathname = '' } } = this.props;
    return sidebarItems.map((plugin, index) => {
      // mapping through each parent item to create the sidebar nav element
      const sidebarItemProps = { ...plugin, pathname };
      if (plugin.subItems) {
        // if this sidebar item has sub items
        // then we need to create and append the children elements
        sidebarItemProps.children = plugin.subItems.map((subItem, subIndex) => {
          const props = {
            ...subItem,
            subItem: true,
            key: `${index}-${subIndex}`
          };
          return React.createElement(SidebarItem, props);
        });
      }

      return React.createElement(SidebarItem, {
        ...sidebarItemProps,
        key: index
      });
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
    const { theme } = this.props;
    return (
      <nav
        className="d-flex flex-column navbar navbar-default navbar-fixed-side"
        style={{ paddingLeft: 0, ...theme.sidebar.container }}
      >
        {this.renderLogo()}
        {this.renderSidebarItems()}
        {this.renderFooter()}
      </nav>
    );
  }
}

export default connectTheme(Sidebar);
