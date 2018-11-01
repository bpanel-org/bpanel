const Config = require('bcfg');
const fs = require('bfile');
const assert = require('bsert');
const { resolve, parse } = require('path');
const logger = require('./logger');

// load main bpanel config
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
    env: true,
    argv: true,
    arg: true
  });

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
function loadClientConfigs(_config) {
  // first let's load the parent bpanel config
  let config = _config;

  // if not passed bcfg object, create one
  if (!(_config instanceof Config)) config = loadConfig('bpanel', _config);

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
  const files = clientFiles.filter(
    name => name[0] !== '.' && /.conf$/.test(name)
  );

  // cancel startup process if there are no clientConfigs
  if (!files.length) {
    logger.error('No client configs found.');
    logger.error(
      'Please add at least one config called "default" to your clients directory and try again.'
    );
    logger.error(
      'Visit the documentation for more information: https://bpanel.org/docs/configuration.html'
    );
    process.exit(1);
  }

  logger.info(`Loading configs for ${files.length} clients...`);
  return files.map(fileName => {
    // After filter, we load bcfg object for each client

    // id is the file name without the extension
    const { name: clientId, ext } = parse(fileName);
    assert(ext === '.conf', 'client configs must have .conf extension');

    const options = {
      id: clientId,
      prefix: `${config.prefix}/${clientsDir}`
    };

    const clientConf = loadConfig(clientId, options);

    // load configs from config file
    // files are loaded from the prefix directory
    clientConf.open(fileName);

    return clientConf;
  });
}

module.exports = { loadClientConfigs, loadConfig };
