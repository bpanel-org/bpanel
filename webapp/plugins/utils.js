// utilities for the plugin system modules
import assert from 'assert';
import semver from 'semver';

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

// plugin to add method and check for duplicates
// and use latest version of plugin
// TODO: Use seamless immutable for modules?
export const addPlugin = (modules = [], plugin) => {
  const { name: pluginName, version: pluginVersion } = plugin.metadata;
  assert(
    !pluginVersion || typeof pluginVersion === 'string',
    'Plugin version must be string'
  );

  if (modules.length) {
    let exists = false;
    const updated = modules.map(module => {
      const { name: moduleName, version: moduleVersion } = module.metadata;
      if (moduleName === pluginName) {
        // if the plugin already exists
        exists = true;
        if (
          (pluginVersion && !moduleVersion) ||
          semver.lt(moduleVersion, pluginVersion)
        ) {
          // and only the newer one has a version but not the existing
          // or the newer one is newer version
          // then replace existing with newer version
          return plugin;
        } else {
          return module;
        }
      } else {
        // otherwise can just return the existing version
        return module;
      }
    });
    // if no match in existing array
    // return array with new plugin pushed on
    if (!exists) updated.push(plugin);
    return updated;
  }
  return [plugin];
};

export const moduleLoader = (config, modules = []) => {
  const { localPlugins, pluginModules, plugins } = config;

  if (localPlugins) {
    // load local plugins from current directory
    assert(
      Array.isArray(localPlugins) && typeof localPlugins[0] === 'string',
      'Local plugins must be an array of strings'
    );
    localPlugins.forEach(async name => {
      try {
        const plugin = require(`./${name}`);
        modules = addPlugin(modules, plugin);
        if (plugin.pluginConfig)
          // doing recursive call if plugin has plugin bundle
          modules = moduleLoader(plugin.pluginConfig, modules);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`There was a problem loading local plugin "${name}:"`, e);
      }
    });
  }

  if (pluginModules) {
    // load pluginModules from plugin config object
    const modulesArr = Array.isArray(pluginModules)
      ? pluginModules
      : [pluginModules];
    modulesArr.forEach(module => {
      assert(
        typeof module !== 'string',
        'pluginModules cannot be strings. You must export the actual modules.'
      );
      assert(
        module.metadata,
        'Each module must have a metadata property and be in the expected plugin format'
      );
      modules = addPlugin(modules, module);
    });
  }

  // if (plugins) {
  //   // load modules from node_modules
  //   assert(
  //     Array.isArray(plugins) && typeof plugins[0] === 'string',
  //     'Plugins must be an array of strings of module names to import from node_modules'
  //   );
  //   plugins.forEach(name => {
  //     const plugin = require(`../../node_modules/${name}`);
  //     modules.push(plugin);
  //     if (plugin.pluginConfig)
  //       // doing recursive call if plugin has plugin bundle
  //       modules = moduleLoader(plugin.pluginConfig, modules);
  //   });
  // }

  return modules;
};
