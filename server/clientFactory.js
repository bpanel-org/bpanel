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

const logger = require('./logger');

const logClientInfo = (id, type, { ssl, host, port, network }) =>
  logger.info(
    `${id}: Configuring ${type} client with uri: ${
      ssl ? 'https' : 'http'
    }://${host}:${port}, network: ${network}`
  );
/*
 * Create clients based on given configs
 * @param {Config} config - a bcfg config object
 * @returns {Object} clients - an object that includes
 * a Node, Wallet, and Multisig Wallet clients as available
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
  if (chain === 'handshake') {
    Network = HSNetwork;
    NodeClient = HSNodeClient;
    WalletClient = HSWalletClient;
  } else {
    // bitcoin settings as fallback
    Network = BNetwork;
    NodeClient = BNodeClient;
    WalletClient = BWalletClient;
  }

  const network = Network.get(config.str('network', 'main'));

  // set fallback network configs from `uri` config if set
  let port = config.int('port', network.rpcPort);
  let hostname = config.str('node-host', '127.0.0.1');
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

  let walletClient, nodeClient, multisigWalletClient;
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

    multisigWalletClient = new MultisigClient({
      ...walletOptions,
      multisigPath: '/'
    });
    logClientInfo(id, 'multisig wallet', walletOptions);
  }

  return { nodeClient, walletClient, multisigWalletClient };
}

module.exports = clientFactory;
