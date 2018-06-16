const Config = require('bcfg');

function loadConfigs(configs) {
  // Setup config object
  // bPanel specific configs, will be prefixed with `BPANEL_` in env
  // dataDir defaults to `~/.[MODULE_NAME]`, where MODULE_NAME
  // is the first argument passed to the Config constructor
  // (i.e. 'bpanel' below)
  const config = new Config('bpanel');
  config.load({
    argv: true,
    env: true
  });

  // load any custom configs being passed in
  config.inject(configs);

  // inject client configs from a config in the client dir
  // pass `client-id` as a command line arg
  // or as env var BPANEL_CLIENT_ID
  // client dir is also configurable with `client-dir`
  // or `BPANEL_CLIENT_DIR`
  const clientDir = config.str('clients-dir', 'clients');
  const clientId = config.str('client-id', 'default');
  config.open(`${clientDir}/${clientId}.conf`);
  return config;
}

module.exports = loadConfigs;
