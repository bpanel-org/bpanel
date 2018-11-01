// Create a bcfg-compatible config file

const Config = require('bcfg');
const assert = require('bsert');
const fs = require('bfile');
const { resolve } = require('path');

const logger = require('./logger');
const clientFactory = require('./clientFactory');
const { loadConfig } = require('./loadConfigs');
/* Supports following use cases:
 * create a new config from scratch
 * update an existing config with new
 * options
 */

async function createClientConfig(options) {
  let clientConfig = options;
  // if not a bcfg object, create one from object
  if (!(options instanceof Config)) {
    // confirm it has an id
    assert(
      typeof options.id === 'string',
      'Must pass a string for the configs id'
    );
    const appConfig = loadConfig('bpanel', options);
    const clientsDir = appConfig.str('clients-dir', 'clients');

    // get full path to client configs relative to the project
    // prefix which defaults to `~/.bpanel`
    const clientsPath = resolve(appConfig.prefix, clientsDir);

    clientConfig = loadConfig(options.id, { ...options, prefix: clientsPath });
  }
  assert(clientConfig.str('id'), 'Client config must have an id');
  const { nodeClient, walletClient, multisigWalletClient } = clientFactory(
    clientConfig
  );

  // test status of clients based on configs
  // throw an error if any of them fail
  const clientErrors = new Error(
    'There was a problem connecting with the clients: '
  );
  clientErrors.failed = [];
  try {
    if (clientConfig.bool('node', true)) await nodeClient.getInfo();
  } catch (e) {
    clientErrors.node = { message: e.message, ...e };
    clientErrors.failed.push('node');
  }
  try {
    if (clientConfig.bool('wallet', true)) await walletClient.getInfo();
  } catch (e) {
    clientErrors.wallet = { message: e.message, ...e };
    clientErrors.failed.push('wallet');
  }
  try {
    if (clientConfig.bool('multisigWallet', true))
      await multisigWalletClient.getInfo();
  } catch (e) {
    clientErrors.multisigWallet = { message: e.message, ...e };
    clientErrors.failed.push('multisigWallet');
  }

  if (clientErrors.node || clientErrors.wallet || clientErrors.multisigWallet) {
    clientErrors.message = clientErrors.message.concat(
      clientErrors.failed.join(', ')
    );
    if (clientConfig.bool('force', false)) {
      logger.warn(clientErrors.message);
      logger.warn('Creating config file anyway...');
    } else {
      throw clientErrors;
    }
  }
  return clientConfig;
}

/*
// **** prepare config text
 // create empty text for config file
 // go through each item in the Config's data property
  // take key, remove '-', and toLowerCase()
  // concat ': ' + value
// add text to file using prefix and id from config
*/

module.exports = {
  createClientConfig
};
