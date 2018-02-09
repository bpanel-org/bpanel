// utilities for the plugin system modules
import { resolve } from 'path';

export const propsReducerCallback = (name, parentProps, ...fnArgs) => (
  acc,
  decorator
) => {
  let props_;
  try {
    props_ = decorator(parentProps, acc, ...fnArgs);
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error(
      'Plugin error',
      `${decorator._pluginName}: Error occurred in \`${name}\``,
      err.stack
    );
    return;
  }

  if (!props_ || typeof props_ !== 'object') {
    // eslint-disable-next-line no-console
    console.error(
      'Plugin error',
      `${decorator._pluginName}: Invalid return value of \`${name}\` (object expected).`
    );
    return;
  }
  return props_;
};

export const loadConnectors = (plugin, type, connectors) => {
  const moduleType = type
    .slice(0, 1)
    .toUpperCase()
    .concat(type.slice(1));
  const module = `mapComponent${moduleType}`;
  // check if the plugin has the module we're looking for
  // e.g. mapComponentState
  if (plugin[module]) {
    for (let key in plugin[module]) {
      if (key[0] === '_') continue; // skip internal properties of module
      if (!connectors[key]) {
        // the connector doesn't exist yet in the cache, initialize it
        connectors[key] = {
          state: [],
          dispatch: []
        };
      }
      // add connector to cache
      connectors[key][type].push(plugin[module][key]);
    }
  }
};

export const moduleLoader = config => {
  const modules = [];
  const { localPlugins, pluginModules, plugins } = config;

  if (localPlugins) {
    // load local plugins from current directory
    assert(
      Array.isArray(localPlugins) && typeof localPlugins[0] === 'string',
      'Local plugins must be an array of strings'
    );
    localPlugins.forEach(name => {
      const plugin = require(`./${name}`);
      modules.push(plugin);
    });
  }

  // if (pluginModules) {
  //   // load pluginModules from plugin config object
  //   const modulesArr = Array.isArray(pluginModules)
  //     ? pluginModules
  //     : [pluginModules];
  //   modulesArr.forEach(module => {
  //     assert(
  //       module.metadata,
  //       'Each module must have a metadata property and be in the expected plugin format'
  //     );
  //     modules.push(module);
  //   });
  // }

  // if (plugins) {
  //   // load modules from node_modules
  //   assert(
  //     Array.isArray(plugins) && typeof plugins[0] === 'string',
  //     'Plugins must be an array of strings of module names to import from node_modules'
  //   );
  //   plugins.forEach(name => {
  //     const plugin = require(`../../node_modules/${name}`);
  //     modules.push(plugin);
  //   });
  // }

  return modules;
};
