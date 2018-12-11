const { parse: urlParse } = require('url');
const { Network: BNetwork } = require('bcoin');
const { Network: HSNetwork } = require('hsd');
const {
  NodeClient: BNodeClient,
  WalletClient: BWalletClient
} = require('bclient');
const {
  NodeClient: HSNodeClient,
  WalletClient: HSWalletClient
} = require('hs-client');
const MultisigClient = require('bmultisig/lib/client');
const assert = require('assert');
const Config = require('bcfg');

const logger = require('../logger');

const logClientInfo = (id, type, { ssl, host, port, network }) =>
  logger.info(
    `${id}: Configuring ${type} client with uri: ${ssl
      ? 'https'
      : 'http'}://${host}:${port}, network: ${network}`
  );

/*
 * Create clients based on given configs
 * @param {Config} config - a bcfg config object
 * @returns {Object} clients - an object that includes
 * a Node, Wallet, and Multisig clients as available
 */
function clientFactory(config) {
  let Network, NodeClient, WalletClient;
  assert(
    config instanceof Config,
    'Must pass instance of Config class to client composer'
  );

  const id = config.str('id');
  assert(id, 'Client config must have an id');

  // bitcoin, bitcoincash, handshake
  if (!config.str('chain'))
    logger.warn(
      `No chain set in configs for ${config.str('id')}, defaulting to 'bitcoin'`
    );

  const chain = config.str('chain', 'bitcoin');

  // set tools based on chain
  switch (chain) {
    case 'handshake':
      Network = HSNetwork;
      NodeClient = HSNodeClient;
      WalletClient = HSWalletClient;
      break;
    case 'bitcoin':
    case 'bitcoincash':
      Network = BNetwork;
      NodeClient = BNodeClient;
      WalletClient = BWalletClient;
      break;
    default:
      throw new Error(`Unrecognized chain ${chain}`);
  }

  const network = Network.get(config.str('network', 'main'));

  // set fallback network configs from `uri` config if set
  let port = config.int('port', network.rpcPort);
  let hostname =
    config.str('node-host', '127.0.0.1') || config.str('host', '127.0.0.1');
  let protocol = config.str('protocol', 'http:');

  let url = config.str('url') || config.str('node-uri');
  if (url) {
    const nodeUrl = urlParse(url);
    port = nodeUrl.port;
    hostname = nodeUrl.hostname;
    protocol = nodeUrl.protocol;
  } else {
    url = `${protocol}//${hostname}:${port}`;
  }

  const ssl =
    config.bool('ssl') || (protocol && protocol.indexOf('https') > -1);
  config.inject({ port, hostname, protocol, ssl });

  const nodeOptions = {
    host: config.str('hostname'),
    apiKey: config.str('api-key'),
    network: config.str('network', 'main'),
    port: config.uint('port'),
    ssl: config.bool('ssl'),
    url: config.str('url') || url
  };

  const walletOptions = {
    ...nodeOptions,
    apiKey: config.str('wallet-api-key', nodeOptions.apiKey),
    port: config.uint('wallet-port', network.walletPort),
    ssl: config.bool('wallet-ssl', nodeOptions.ssl),
    token: config.str('wallet-token'),
    url: config.str('wallet-uri') || config.str('wallet-url')
  };

  // set any options that are empty strings to undefined
  for (let options of [nodeOptions, walletOptions]) {
    for (let key in options) {
      if (typeof options[key] === 'string' && !options[key].length)
        options[key] = undefined;
    }
  }

  let walletClient, nodeClient, multisigClient;
  // check if config explicitly sets node config to `false`
  // if false, do not instantiate new node client
  if (config.bool('node', true)) {
    nodeClient = new NodeClient(nodeOptions);
    logClientInfo(id, 'node', nodeOptions);
  }

  // check if config explicitly sets wallet config to `false`
  // if false, do not instantiate new wallet client
  if (config.bool('wallet', true)) {
    walletClient = new WalletClient(walletOptions);
    logClientInfo(id, 'wallet', walletOptions);
  }

  if (config.bool('multisig', true)) {
    multisigClient = new MultisigClient({
      ...walletOptions,
      multisigPath: '/'
    });
    logClientInfo(id, 'multisig wallet', walletOptions);
  }

  return { nodeClient, walletClient, multisigClient };
}

/*
 * Build a map of all clients.
 * @param {bcfg.Config} config - the main app config object
 * @returns {Object} - a map of the configs and the clients
 */
function buildClients(config) {
  const { loadClientConfigs, createConfigsMap } = require('./configs');
  // loadConfigs uses the bpanelConfig to find the clients and build
  // each of their configs.
  const clientConfigs = loadClientConfigs(config);
  const configsMap = createConfigsMap(clientConfigs);
  if (!clientConfigs.length)
    logger.warn(
      'Could not find any client config files. You can use the Connection Manager \
      settings plugin or read more about configuring connections in the documentation: \
      https://bpanel.org/docs/configuration.html'
    );
  const clients = clientConfigs.reduce((clientsMap, cfg) => {
    const id = cfg.str('id');
    assert(id, 'client config must have id');
    clientsMap.set(id, { ...clientFactory(cfg), config: cfg });
    return clientsMap;
  }, new Map());
  return { configsMap, clients };
}

/*
 * utility function for getting object of clients
 * @param {String} id - id of clients to retrieve
 * @param {Map} clientsMap - map of all clients to get relevent
 * @returns {Object} clients - object of only clients for that id
 */
function getClientsById(id, clientsMap) {
  assert(typeof id === 'string', 'Expected an id of type string');
  assert(clientsMap instanceof Map, 'Expected a map of clients');
  const { nodeClient, walletClient, multisigClient } = clientsMap.get(id);
  const clients = {};
  if (nodeClient) clients.node = nodeClient;
  if (walletClient) clients.wallet = walletClient;
  if (multisigClient) clients.multisig = multisigClient;
  return clients;
}

module.exports = {
  clientFactory,
  buildClients,
  getClientsById
};
