// Create a bcfg-compatible config file

const assert = require('bsert');
const fs = require('bfile');
const { resolve, parse, join } = require('path');
const Config = require('bcfg');

const pkg = require('../../pkg');
const logger = require('../logger');
const { clientFactory } = require('../utils/clients');

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
  }

  return config;
}

function getConfigFromOptions(options) {
  if (!(options instanceof Config)) options = loadConfig(options.id, options);
  assert(options.str('id'), 'must pass an id to test config options');
  // making a copy from options and data properties
  // to avoid any mutations
  return loadConfig(options.str('id'), {
    ...options.options,
    ...options.data
  });
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
    logger.warn(
      'No client configs found. Add one manually to your clients directory \
or use the connection-manager plugin to add via the UI'
    );
    logger.warn(
      'Visit the documentation for more information: https://bpanel.org/docs/configuration.html'
    );
    return files;
  }

  logger.info('Loading configs for %s clients...', files.length);
  return files.map(fileName => {
    // After filter, we load bcfg object for each client

    // id is the file name without the extension
    const { name: clientId, ext } = parse(fileName);
    assert(ext === '.conf', 'client configs must have .conf extension');

    const options = {
      id: clientId,
      prefix: join(config.prefix, clientsDir)
    };

    const clientConf = loadConfig(clientId, options);

    // load configs from config file
    // files are loaded from the prefix directory
    clientConf.open(fileName);

    return clientConf;
  });
}

/*
 * Retrieve a config from clients directory
 * @param {string} id - id of client to retrieve
 * @returns {bcfg.Config} - bcfg object of config
 */

function getConfig(id) {
  assert(typeof id === 'string', 'Client config must have an id');

  const appConfig = loadConfig('bpanel');
  const clientsDir = appConfig.str('clients-dir', 'clients');

  const clientsPath = resolve(appConfig.prefix, clientsDir);
  const config = loadConfig(id, { id, prefix: clientsPath });

  const path = resolve(clientsPath, `${id}.conf`);
  if (!fs.existsSync(path)) {
    const error = new Error(`File ${id}.conf not found`);
    error.code = 'ENOENT';
    throw error;
  }

  config.open(`${id}.conf`);
  return config;
}

/*
 * create and test clients based on a passed config
 * @param {Config} clientConfig
 * @throws {ClientErrors} - throws if at least one client fails
 * @returns {[bool, ClientErrors]} [err, ClientErrors] - bool is true
 * if there was an error, false if no error.
 */

async function testConfigOptions(options) {
  let clientConfig;
  try {
    clientConfig = getConfigFromOptions(options);
  } catch (e) {
    throw e;
  }

  const agents = new Map([
    ['bcoin', 'bitcoin'],
    ['bcash', 'bitcoincash'],
    ['hsd', 'handshake']
  ]);

  const clientErrors = new ClientErrors();
  const chain = clientConfig.str('chain', 'bitcoin');

  if (!pkg.chains.includes(chain))
    throw new Error(`${chain} is not a recognized chain`);

  const clients = clientFactory(clientConfig);

  // save the async checks in an array so we can parallelize the
  // network call with a `Promise.all`
  const clientChecks = [];

  // check each client to see if it can connect
  // for each failure, `addFailed` to the error object
  for (let key in clients) {
    // keys come back of the form "nodeClient"
    // to get the type we need to remove "Client" from the string
    const type = key.substr(0, key.indexOf('Client'));
    const check = new Promise(async resolve => {
      try {
        logger.info(`Checking ${key} for config "${clientConfig.str('id')}"`);
        if (clientConfig.bool(type, true)) {
          const info = await clients[key].getInfo();
          if (info) {
            const { pool: { agent } } = info;
            // find implementation from user agent
            const implementation = agent.match(/(\w*)(?=:)/)[0];
            assert(agents.has(implementation), `Agent ${agent} not supported.`);
            if (agents.get(implementation) !== chain)
              throw new Error(
                `Chain config of "${chain}" did not match the node's chain "${agents.get(
                  implementation
                )}"`
              );
          }
        }
      } catch (e) {
        logger.info(
          '%s connection for "%s" failed.',
          key,
          clientConfig.str('id')
        );
        clientErrors.addFailed(type, e);
      } finally {
        // resolving all calls so that we can store the failures in the
        // clientErrors object
        resolve();
      }
    });
    clientChecks.push(check);
  }

  await Promise.all(clientChecks);

  if (clientErrors.failed.length) {
    clientErrors.composeMessage();
    return [true, clientErrors];
  }

  return [false, null];
}

/*
 * Simple utility for getting a default config with logging
 * for certain edge cases
 * @param {Config} bpanelConfig
 * @returns {Config}
 */

function getDefaultConfig(bpanelConfig) {
  assert(
    bpanelConfig instanceof Config,
    'Need the main bcfg for the app to get default configs'
  );
  const clientConfigs = loadClientConfigs(bpanelConfig);

  if (!clientConfigs || !clientConfigs.length) return undefined;

  let defaultClientConfig = clientConfigs.find(
    cfg => cfg.str('id') === bpanelConfig.str('client-id', 'default')
  );

  if (!defaultClientConfig) {
    logger.warn(
      'Could not find config for %s. Will set to "default" instead.',
      bpanelConfig.str('client-id')
    );
    defaultClientConfig = clientConfigs.find(
      cfg => cfg.str('id') === 'default'
    );
    if (!defaultClientConfig) {
      logger.warn('Could not find default client config.');
      defaultClientConfig = clientConfigs[0];
      logger.warn(`Setting fallback to ${defaultClientConfig.str('id')}.`);
    }
  }
  return defaultClientConfig;
}

function createConfigsMap(configs) {
  assert(Array.isArray(configs), 'Must pass an array to get map of configs');
  return configs.reduce((clientsMap, cfg) => {
    assert(cfg instanceof Config, 'Must pass an array of configs');
    const id = cfg.str('id');
    assert(id, 'client config must have id');
    clientsMap.set(id, cfg);
    return clientsMap;
  }, new Map());
}

/*
 * create client config
 * Note: This will actually create the file in your bpanel prefix location
 * @param {string} id - id for the client
 * @param {Object} options object for a bcoin/hsd client
 * @param {bool} force - whether or not to force config creation if client
 * can't connect
 * @returns {bcfg.Config}
 */
async function createClientConfig(id, options = {}, force = false) {
  assert(typeof id === 'string', 'Must pass an id as first paramater');

  let clientConfig = options;
  if (!(options instanceof Config))
    clientConfig = getConfigFromOptions({ id, ...options });

  const appConfig = loadConfig('bpanel', options);
  const clientsDir = appConfig.str('clients-dir', 'clients');

  // get full path to client configs relative to the project
  // prefix which defaults to `~/.bpanel`
  const clientsPath = resolve(appConfig.prefix, clientsDir);

  const [err, clientErrors] = await testConfigOptions(clientConfig);
  assert(typeof force === 'boolean', 'The force argument must be a bool.');
  if (err && force) {
    logger.warn(clientErrors.message);
    logger.warn('Creating config file anyway...');
  } else if (err) {
    throw clientErrors;
  }

  let configTxt = '';
  for (let key in clientConfig.options) {
    const configKey = key
      .replace('-', '')
      .replace('_', '')
      .toLowerCase();
    const text = `${configKey}: ${clientConfig.options[key]}\n`;
    configTxt = configTxt.concat(text);
  }
  if (!fs.existsSync(clientsPath)) {
    logger.warn(
      'Could not find requested client directory at %s. Creating new one...',
      clientsPath
    );
    fs.mkdirpSync(clientsPath);
  }
  fs.writeFileSync(`${clientsPath}/${clientConfig.str('id')}.conf`, configTxt);
  return clientConfig;
}

class ClientErrors extends Error {
  constructor(...options) {
    super(...options);
    this.failed = [];
  }

  addFailed(clientType, error) {
    assert(typeof clientType === 'string');
    this[clientType] = { message: error.message, ...error };
    this.failed.push(clientType);
  }

  composeMessage() {
    // compose only if there isn't a custom message
    if (!this.message.length) {
      const prefix =
        'There was a problem connecting with the following clients: ';
      this.message = prefix.concat(this.failed.join(', '));
    }
  }
}

module.exports = {
  createClientConfig,
  loadConfig,
  getConfigFromOptions,
  loadClientConfigs,
  createConfigsMap,
  getDefaultConfig,
  getConfig,
  ClientErrors,
  testConfigOptions
};
