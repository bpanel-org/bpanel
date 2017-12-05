import React from 'react';
import PropTypes from 'prop-types';

import './sidebar.scss';
import { pluginMetaProps } from '../../containers/App/App';

const sidebarItem = (
  //eslint-disable-next-line react/prop-types
  { name, icon = 'cog', subItem = false, children }
) => (
  <div className={`nav-item ${subItem ? 'subItem' : ''}`}>
    <i className={`fa fa-${icon}`} />
    {name}
    {children}
  </div>
);

const Sidebar = ({ pluginMeta }) => {
  const commitHash = process.env.__COMMIT__.slice(0, 7);
  const version = process.env.__VERSION__;
  const { parentItems, subItems } = pluginMeta;
  return (
    <nav className="col-3 d-flex flex-column sidebar">
      {parentItems.map((plugin, index) => {
        // mapping through each parent item to create the sidebar nav element
        const sidebarItemProps = { ...plugin };
        if (subItems.has(plugin.name)) {
          // if this sidebar item has sub items
          // then we need to create the children elements
          sidebarItemProps.children = [];
          const children = subItems.get(plugin.name);

          children.forEach((subItem, subIndex) => {
            const props = {
              ...subItem,
              subItem: true,
              key: `${index}-${subIndex}`
            };
            const child = React.createElement(sidebarItem, props);
            sidebarItemProps.children.push(child);
          });
        }

        return React.createElement(sidebarItem, {
          ...sidebarItemProps,
          key: index
        });
      })}
      <div className="sidebar-footer mt-auto text-center">
        <h5>bPanel</h5>
        <p className="version subtext text-truncate">version: {version}</p>
        <p className="commit subtext text-truncate">
          commit hash: {commitHash}
        </p>
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

sidebarItem.propTypes = {
  ...sidebarItemPropTypes,
  children: PropTypes.arrayOf(PropTypes.element)
};

Sidebar.propTypes = {
  pluginMeta: PropTypes.shape({
    parentItems: PropTypes.arrayOf(PropTypes.shape(pluginMetaProps)),
    subItems: PropTypes.object
  })
};

export default Sidebar;
