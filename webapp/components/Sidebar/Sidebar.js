import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './sidebar.scss';
import { pluginMetaProps } from '../../containers/App/App';
import SidebarItem from './SidebarItem';
import logo from '../../assets/logo.png';

const Sidebar = ({ sidebarItems, location: { pathname = '' } }) => {
  const commitHash = process.env.__COMMIT__.slice(0, 7);
  const version = process.env.__VERSION__;
  return (
    <nav
      className="d-flex flex-column navbar navbar-default navbar-fixed-side sidebar"
      style={{ paddingLeft: 0 }}
    >
      <Link to="/">
        <div className="sidebar-logo">
          <img src={logo} className="logo" width="60" height="60" />
        </div>
      </Link>
      {sidebarItems.map((plugin, index) => {
        // mapping through each parent item to create the sidebar nav element
        const sidebarItemProps = { ...plugin, pathname };
        if (plugin.subItems) {
          // if this sidebar item has sub items
          // then we need to create and append the children elements
          sidebarItemProps.children = plugin.subItems.map(
            (subItem, subIndex) => {
              const props = {
                ...subItem,
                subItem: true,
                key: `${index}-${subIndex}`
              };
              return React.createElement(SidebarItem, props);
            }
          );
        }

        return React.createElement(SidebarItem, {
          ...sidebarItemProps,
          key: index
        });
      })}
      <div className="sidebar-footer mt-auto text-center">
        <h5>bpanel</h5>
        <p className="version subtext text-truncate">bcoin: {version}</p>
        <p className="commit subtext text-truncate">UI: {commitHash}</p>
      </div>
      <div className="col-sm-1" />
    </nav>
  );
};

const sidebarItemPropTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  subItem: PropTypes.bool
};

Sidebar.propTypes = {
  sidebarItems: PropTypes.arrayOf(
    PropTypes.shape({
      ...pluginMetaProps,
      subItems: PropTypes.arrayOf(PropTypes.shape(pluginMetaProps))
    })
  )
};

export default Sidebar;
