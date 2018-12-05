const assert = require('bsert');
const Config = require('bcfg');

function getPluginEndpoints(config, logger) {
  assert(config instanceof Config, 'Expected a bcfg object');
  const beforeMiddleware = [];
  const afterMiddleware = [];
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
    let module, pkg;

    try {
      pkg = require(`${plugin}/package.json`);
      module = require(`${plugin}/server`);
    } catch (e) {
      logger.debug(
        'Problem loading backend plugins for %s: %s',
        pkg.name,
        e.message
      );
    }
    if (!module || !Object.keys(module).length) continue;

    const {
      beforeCoreMiddleware = [],
      afterCoreMiddleware = [],
      endpoints = []
    } = module;
    const { name, version } = pkg;

    logger.info('Building endpoints middleware for %s@%s', name, version);
    if (beforeCoreMiddleware)
      assert(
        Array.isArray(beforeCoreMiddleware),
        'Expected an array for beforeCoreMiddleware export.'
      );
    if (afterCoreMiddleware)
      assert(
        Array.isArray(afterCoreMiddleware),
        'Expected an array for afterCoreMiddleware export.'
      );

    beforeMiddleware.push(...endpoints, ...beforeCoreMiddleware);
    afterMiddleware.push(...afterCoreMiddleware);
  }
  return { beforeMiddleware, afterMiddleware };
}

module.exports = {
  getPluginEndpoints
};
