const Config = require('bcfg');
const fs = require('fs');
const { resolve } = require('path');

// load main bpanel config
function loadMainConfig(options = {}) {
  const config = new Config('bpanel');
  config.load({
    env: true,
    argv: true,
    arg: true
  });

  // load any custom configs being passed in
  config.inject(options);

  return config;
}

/*
 * Get an array of configs for each client
 * in the module's home directory
 * @param {Object} [configs] - Object of custom configs to inject
 * into the bcfg config object
 * @returns {Config[]} An array of Config object which can be
 * used to load clients
 */
function loadConfigs(_config) {
  // first let's load the parent bpanel config
  let config = _config;

  // if not passed bcfg object, create one
  if (!(_config instanceof Config)) config = loadMainConfig(_config);

  // clientsDir is the folder where all client configs
  // should be saved and can be changed w/ custom configs
  const clientsDir = config.str('clients-dir', 'clients');

  // get full path to client configs relative to the project
  // prefix which defaults to `~/.bpanel`
  const clientsPath = resolve(config.prefix, clientsDir);
  const clientFiles = fs.readdirSync(clientsPath);

  // ignore file names that start with a '.' such as
  // system files and files without `.conf` extension
  // then load config for that client
  return clientFiles
    .filter(name => name[0] !== '.' && /.conf$/.test(name))
    .map(fileName => {
      // After filter, we load bcfg object for each client

      // id is the file name without the extension
      const clientId = fileName.slice(0, -5);
      const clientConf = new Config(clientId);

      // set an id in the conf if not set
      // prefix for the client config should be a clients dir
      // in the parent config's directory
      clientConf.inject({
        id: clientId,
        prefix: `${config.prefix}/${clientsDir}`
      });

      // can pass configs to clients via argv and env
      // will be the same for each config returned
      clientConf.load({
        argv: true,
        env: true
      });

      // load configs from config file
      // files are loaded from the prefix directory
      clientConf.open(fileName);

      return clientConf;
    });
}

module.exports = loadConfigs;
