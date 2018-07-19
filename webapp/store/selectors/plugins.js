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
    .sort(comparePlugins)
    .map(parent => {
      // go through each parentItem to see if it has subItems
      const extendedParent = { ...parent };
      if (subItems.has(parent.name)) {
        // if subItems has a matching parent, then extend parent to include children
        const children = subItems.get(parent.name);
        extendedParent.subItems = children.sort(comparePlugins);
      }
      return extendedParent;
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
  return plugins.map(plugin => {
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
    return plugin;
  });
};

const getSortedPluginMetadata = createSelector(
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

export default {
  getSortedPluginMetadata,
  metadataWithUniquePaths,
  uniquePathsByName
};
