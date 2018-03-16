// utilities for the plugin system modules
import assert from 'assert';
import semver from 'semver';
import validate from 'validate-npm-package-name';

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

// utility to check plugin metadata
// conforms to expected format.
export const checkMetadata = metadata => {
  const { name, displayName, pathName } = metadata;
  const updatedMeta = { ...metadata };
  // check `name` exists and conforms to npm rules
  assert(name, 'Plugin must have a name');
  const { errors = [], warnings = [] } = validate(name);
  assert(
    !errors.length && !warnings.length,
    `${name}: ` + errors.concat(warnings).join(' & ')
  );
  // check `displayName` exists
  // if it doesn't, duplicate from `name`
  if (!displayName) updatedMeta.displayName = name;
  // encode pathName if it exists
  if (pathName) updatedMeta.pathName = encodeURI(pathName);

  return updatedMeta;
};

// add plugin to list and check for duplicates
// use latest version of plugin if duplicate exists
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
        }
      }
      // otherwise can just return the existing version
      return module;
    });
    // if no match in existing array
    // return array with new plugin pushed on
    if (!exists) updated.push(plugin);
    return updated;
  }
  return [plugin];
};

export const moduleLoader = (config, modules = []) => {
  const { plugins } = config;
  if (plugins) {
    // load plugin exports from config
    const pluginsArr = Array.isArray(plugins) ? plugins : [plugins];
    pluginsArr.forEach(plugin => {
      try {
        assert(
          typeof plugin !== 'string' && plugin.metadata,
          'Plugin must be an exported plugin module with a metadata property'
        );
        const updatedMeta = checkMetadata(plugin.metadata);
        assert(updatedMeta, 'Plugin could not load due to metadata failure');
        plugin.metadata = updatedMeta;
        modules = addPlugin(modules, plugin);
        if (plugin.pluginConfig)
          // doing recursive call if plugin has plugin bundle
          modules = moduleLoader(plugin.pluginConfig, modules);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Plugin failure: ${e.message} \n`, plugin);
      }
    });
  }

  return modules;
};
