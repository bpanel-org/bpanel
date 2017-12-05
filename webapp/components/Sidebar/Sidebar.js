import React from 'react';
import PropTypes from 'prop-types';
import './sidebar.scss';

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

const comparePlugins = (pluginA, pluginB) => {
  // first sort by order, if order is same then order by name
  if (pluginA.order > pluginB.order) {
    return 1;
  } else if (pluginA.order < pluginB.order) {
    return -1;
  } else if (pluginA.name > pluginB.name) {
    return 1;
  } else if (pluginA.name < pluginB.name) {
    return -1;
  } else {
    return 0;
  }
};

const Sidebar = ({ pluginMeta }) => {
  const commitHash = process.env.__COMMIT__.slice(0, 7);
  const version = process.env.__VERSION__;
  const subItems = {};
  return (
    <nav className="col-3 d-flex flex-column sidebar">
      {pluginMeta
        .filter(plugin => {
          if (plugin.parent) {
            // if it has a parent then add it to corresponding array in subItems object
            const { parent } = plugin;
            if (subItems[parent] === undefined) {
              subItems[parent] = [plugin];
            } else {
              subItems[parent].push(plugin);
            }
            // don't return to array of top level items
            return false;
          }
          // return to have array of just top level sidebar items
          return true;
        })
        .sort(comparePlugins)
        .map((plugin, index) => {
          // once sorted, return sidebar item elements
          const sidebarItemProps = { ...plugin };
          // check if this sidebar has subItems
          if (subItems[sidebarItemProps.name]) {
            // if it has subitems we need to compose those sidebar items
            // and pass them on as children to the parent item
            sidebarItemProps.children = [];
            // go through list of subItems for this parent, sort children
            // then create sidebarItem elements for each child
            subItems[sidebarItemProps.name]
              .sort(comparePlugins)
              .forEach((subItem, subIndex) => {
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
  pluginMeta: PropTypes.arrayOf(PropTypes.shape(sidebarItem.propTypes))
};

export default Sidebar;
