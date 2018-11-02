// Create a bcfg-compatible config file

const assert = require('bsert');
const fs = require('bfile');
const { resolve } = require('path');
const Config = require('bcfg');

const logger = require('./logger');
const clientFactory = require('./clientFactory');
const { loadConfig, getConfigFromOptions } = require('./loadConfigs');

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
  // assert(options, 'Must pass config options to create a client');

  let clientConfig = options;
  if (!(options instanceof Config))
    clientConfig = getConfigFromOptions({ id, ...options });

  const appConfig = loadConfig('bpanel', options);
  const clientsDir = appConfig.str('clients-dir', 'clients');

  // get full path to client configs relative to the project
  // prefix which defaults to `~/.bpanel`
  const clientsPath = resolve(appConfig.prefix, clientsDir);

  try {
    await testConfigOptions(clientConfig);
  } catch (e) {
    if (force) {
      logger.warn(e.message);
      logger.warn('Creating config file anyway...');
    } else throw e;
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
      `Could not find requested client directory at ${clientsPath}. Creating new one...`
    );
    fs.mkdirpSync(clientsPath);
  }
  fs.writeFileSync(`${clientsPath}/${clientConfig.str('id')}.conf`, configTxt);
  return clientConfig;
}

/*
 * Retrieve a config from clients directory
 * @param {string} id - id of client to retrieve
 * @returns {bcfg.Config} - bcfg object of config
 */
async function getConfig(id) {
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
 * @returns void
 */

async function testConfigOptions(options) {
  const clientConfig = getConfigFromOptions(options);
  const { nodeClient, walletClient, multisigWalletClient } = clientFactory(
    clientConfig
  );

  const clientErrors = new ClientErrors();

  try {
    if (clientConfig.bool('node', true)) await nodeClient.getInfo();
  } catch (e) {
    clientErrors.addFailed('node', e);
  }
  try {
    if (clientConfig.bool('wallet', true)) await walletClient.getInfo();
  } catch (e) {
    clientErrors.addFailed('wallet', e);
  }
  try {
    if (clientConfig.bool('multisigWallet', true))
      await multisigWalletClient.getInfo();
  } catch (e) {
    clientErrors.addFailed('multisigWallet', e);
  }

  if (clientErrors.failed.length) {
    clientErrors.composeMessage();
    throw clientErrors;
  }
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
  getConfig,
  ClientErrors,
  testConfigOptions
};
