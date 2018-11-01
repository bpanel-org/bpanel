// Create a bcfg-compatible config file

const assert = require('bsert');
const fs = require('bfile');
const { resolve } = require('path');

const logger = require('./logger');
const clientFactory = require('./clientFactory');
const { loadConfig, getConfigFromOptions } = require('./loadConfigs');

/*
 * create client config
 * Note: This will actually create the file in your bpanel prefix location
 * @param {Object} options object for a bcoin/hsd client
 * @returns {bcfg.Config}
 */
async function createClientConfig(options) {
  let clientConfig = getConfigFromOptions(options);
  assert(clientConfig.str('id'), 'Client config must have an id');

  const appConfig = loadConfig('bpanel', options);
  const clientsDir = appConfig.str('clients-dir', 'clients');

  // get full path to client configs relative to the project
  // prefix which defaults to `~/.bpanel`
  const clientsPath = resolve(appConfig.prefix, clientsDir);

  await testConfigOptions(clientConfig);

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
    if (clientConfig.bool('force', false)) {
      logger.warn(clientErrors.message);
      logger.warn('Creating config file anyway...');
    } else {
      throw clientErrors;
    }
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
  ClientErrors,
  testConfigOptions
};
