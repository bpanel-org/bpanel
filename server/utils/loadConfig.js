const assert = require('bsert');
const fs = require('bfile');
const Config = require('bcfg');

/*
 * Load up a bcfg object for a given module and set of options
 * @params {string} - name - module name
 * @params {object} - [options] - optional options object to inject into config
 * @returns {Config} - returns a bcfg object
 */
function loadConfig(name, options = {}) {
  assert(typeof name === 'string', 'Must pass a name to load config');
  const config = new Config(name);

  // load any custom configs being passed in
  config.inject(options);

  config.load({
    env: true
  });

  if (name === 'bpanel') {
    config.load({
      argv: true
    });

    const configFile = config.location('config.js');
    if (fs.existsSync(configFile)) {
      const fileOptions = require(configFile);
      config.inject(fileOptions);
    }
  }

  return config;
}

module.exports = loadConfig;
