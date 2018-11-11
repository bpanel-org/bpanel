const assert = require('bsert');
const Config = require('bcfg');

function getPluginEndpoints(config) {
  assert(config instanceof Config, 'Expected a bcfg object');
  const beforeCoreMiddleware = [];
  const afterCoreMiddleware = [];
  // load list of plugins and local plugins from config
  const plugins = config.array('plugins', []);
  plugins.push(...config.array('localPlugins', []));

  // go through each plugin id in the list
  for (let plugin of plugins) {
    assert(
      typeof plugin === 'string',
      `Expected plugin name to be a string instead got a ${typeof plugin}`
    );

    // require the `server` entrypoint for each (skip if no entry)
    let module;
    try {
      module = require(`${plugin}/server`);
    } catch (e) {}

    if (!module) continue;

    const { configs, endpoints = [] } = module;

    if (configs && configs.afterCoreMiddleware)
      afterCoreMiddleware.push(...endpoints);
    else beforeCoreMiddleware.push(...endpoints);
  }
  return { beforeCoreMiddleware, afterCoreMiddleware };
}

module.exports = {
  getPluginEndpoints
};
