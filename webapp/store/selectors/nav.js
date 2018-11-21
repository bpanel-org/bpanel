import assert from 'assert';
import { createSelector } from 'reselect';
import { plugins } from '@bpanel/bpanel-utils';

const { comparePlugins } = plugins;

const getMetadataList = state => Object.values(state.pluginMetadata);
const getSidebarItems = state => state.nav.sidebar;

/* Sort plugin metadata (by order and name) and insert and
 * sort children after parents
 * @param {Array{}} pluginMeta - unsorted array of plugin Metadata
 * @returns {Array{}} plugins - returns an array of sorted metadata objects
 */
export const sortPluginMetadata = (pluginMeta = []) => {
  assert(Array.isArray(pluginMeta), 'Must pass array of metadata');

  const { parents, subItems } = pluginMeta.reduce(
    ({ parents, subItems }, plugin) => {
      if (plugin.parent) {
        // if it has a parent then add it to corresponding array in subItems map
        // this is so that we can get all subItems and then sort later
        const { parent } = plugin;
        if (!subItems.has(parent)) {
          subItems.set(parent, [plugin]);
        } else {
          const children = subItems.get(parent);
          children.push(plugin);
          subItems.set(parent, children);
        }
      } else {
        parents.push(plugin);
      }
      return { parents, subItems };
    },
    { parents: [], subItems: new Map() }
  );

  return parents.sort(comparePlugins).reduce((sortedPluginMetadata, parent) => {
    if (subItems.has(parent.name)) {
      const children = subItems.get(parent.name);
      children.sort(comparePlugins);
      return [...sortedPluginMetadata, parent, ...children];
    }
    return [...sortedPluginMetadata, parent];
  }, []);
};

/* Sanitize paths
 * @param {Array{}} navItems - array of navItem objects
 * @returns {Array{}} navItems - nav items with sanitized paths
 */
export function sanitizePaths(navItems) {
  return navItems.map(item => {
    if (item.pathName && item.pathName.indexOf('http') !== 0)
      item.pathName = item.pathName.replace(/^(\/)+/, '');
    return item;
  });
}

/* Update list of plugin metadata (or nav objects) to have properly
 * formatted, nested paths
 * e.g. { name: 'child', parent: 'parent' } becomes
 * { name: 'child', parent: 'parent', pathName: 'parent/child'}
 * @param {Array{}} metadata - Array of plugin metadata objects
 * @returns {Array{}} plugins - returns an array of metadata w/ updated paths
 */
export function getNestedPaths(metadata) {
  assert(Array.isArray(metadata), 'Must pass array of metadata');
  return metadata.reduce((updated, _plugin) => {
    const plugin = { ..._plugin };
    if (plugin.parent && !/^(http)/.test(plugin.pathName)) {
      // if this plugin is a child then update its pathName property
      // to nest behind the parent
      const parentIndex = metadata.findIndex(
        item => item.name === plugin.parent
      );

      const parent = metadata[parentIndex];
      // eslint-disable-next-line no-console
      console.assert(
        parent,
        `Parent ${plugin.parent} could not be found for child ${plugin.name}`
      );
      // get parent path, if none, use name
      const parentPath = parent.pathName ? parent.pathName : parent.name;

      // get plugin path, if none, use name
      let pathName = plugin.pathName ? plugin.pathName : plugin.name;

      // sanitize of any other uri constructions like other nested paths
      pathName = pathName.slice(pathName.lastIndexOf('/') + 1);

      // make nested path
      pathName = `${parentPath}/${pathName}`;
      plugin.pathName = pathName;
    }
    updated.push(plugin);
    return updated;
  }, []);
}

export function getNavItems(metadata = []) {
  assert(Array.isArray(metadata), 'Must pass array to getNavItems');
  return metadata.filter(plugin => plugin.nav || plugin.sidebar);
}

// Properly compose metadata for navigation
// sort list of metadata -> compose nested paths -> make paths unique
function composeNavItems(_navItems = []) {
  assert(Array.isArray(_navItems), 'Must pass array to composeNavItems');
  let navItems = getNavItems(_navItems);
  navItems = sortPluginMetadata(navItems);
  navItems = sanitizePaths(navItems);
  navItems = getNestedPaths(navItems);
  return navItems;
}

// selectors for converting pluginMetadata to nav list
export const sortedNavItems = createSelector(
  getMetadataList,
  composeNavItems
);

// selector for ordering and composing sidebar navigation items
export const sortedSidebarItems = createSelector(
  getSidebarItems,
  composeNavItems
);

// Useful selector for the Panel which just needs to match names to paths
export const uniquePathsByName = createSelector(
  getMetadataList,
  metadata =>
    metadata
      .filter(plugin => plugin.pathName)
      .reduce(
        (paths, { name, pathName }) => ({ ...paths, [name]: pathName }),
        {}
      )
);

export default {
  sortedNavItems,
  uniquePathsByName,
  sortedSidebarItems
};
