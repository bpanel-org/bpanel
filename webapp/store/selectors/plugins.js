import assert from 'assert';
import { createSelector } from 'reselect';
import { plugins } from '@bpanel/bpanel-utils';

const { comparePlugins } = plugins;

const getPluginMetadata = state => state.pluginMetadata;

export const sortPluginMetadata = pluginMeta => {
  const subItems = new Map();

  const sortedPluginMetadata = Object.values(pluginMeta)
    .filter(plugin => {
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
        // don't return to array of top level items
        return false;
      } else {
        // only returning an array of the parents
        return true;
      }
    })
    .sort(comparePlugins);

  subItems.forEach((children, parent) => {
    const index = sortedPluginMetadata.findIndex(
      plugin => parent === plugin.name
    );
    children.sort(comparePlugins);
    sortedPluginMetadata.splice(index + 1, 0, ...children);
  });

  return sortedPluginMetadata;
};

/* Get sorted plugin metadata list w/ unique pathNames
 * @param {Object{}} metadata - object of plugin metadata objects
 * @returns {Array{}} plugins - returns an array of sorted metadata objects
 */
export const uniquePathNames = metadata => {
  const plugins = sortPluginMetadata(metadata);
  const paths = new Set();
  return plugins.reduce((acc, plugin) => {
    const { pathName } = plugin;
    if (pathName) {
      let path = pathName;

      // if the pathName is also the name of a plugin
      // and that plugin is not the current one being tested
      // add that to the paths set to avoid conflicts w/ names
      if (metadata[path] && metadata[path].pathName !== path) paths.add(path);

      if (paths.has(path)) {
        // find unique suffix by incrementing counter
        let counter = 1;
        while (paths.has(`${path}-${counter}`)) {
          counter++;
        }
        path = `${path}-${counter}`;
      }
      paths.add(path);
      // set the metadata to the unique path
      plugin.pathName = path;
    }
    acc.push(plugin);
    return acc;
  }, []);
};

export function getNestedPaths(metadata) {
  assert(Array.isArray(metadata), 'Must pass array of metadata');
  return metadata.reduce((updated, plugin) => {
    if (plugin.parent) {
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
      const parentPath = parent.pathName ? parent.pathName : parent.name;
      const pathName = plugin.pathName
        ? `${parentPath}/${plugin.pathName}`
        : `${parentPath}/${plugin.name}`;
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

const sortedPluginMetadata = createSelector(
  [getPluginMetadata],
  sortPluginMetadata
);

const metadataWithUniquePaths = createSelector(
  [getPluginMetadata],
  uniquePathNames
);

const uniquePathsByName = createSelector(
  [metadataWithUniquePaths],
  metadata => {
    const paths = {};
    metadata
      .filter(plugin => plugin.pathName)
      .forEach(({ name, pathName }) => (paths[name] = pathName));
    return paths;
  }
);

const nestedPaths = createSelector(
  [sortedPluginMetadata, uniquePathsByName],
  getNestedPaths
);

const navItems = createSelector([nestedPaths], getNavItems);

export default {
  sortedPluginMetadata,
  metadataWithUniquePaths,
  uniquePathsByName,
  navItems,
  nestedPaths
};
