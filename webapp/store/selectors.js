'use strict';

import { comparePlugins } from '../utils/utils';

export const sortPluginMeta = pluginMeta => {
  const subItems = new Map();

  const parentItems = pluginMeta
    .filter(plugin => {
      if (plugin.parent) {
        // if it has a parent then add it to corresponding array in subItems map
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
      }
      // return to have array of just top level sidebar items
      return true;
    })
    .sort(comparePlugins);

  subItems.forEach(children => {
    children.sort(comparePlugins);
  });

  return { parentItems, subItems };
};
