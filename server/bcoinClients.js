const url = require('url');
const { Network } = require('bcoin');
const { NodeClient, WalletClient } = require('bclient');
const logger = require('./logger');
const assert = require('assert');
const Config = require('bcfg');

module.exports = config => {
  assert(
    config instanceof Config,
    'Must pass instance of Config class to client composer'
  );

  // use network fallbacks
  const network = Network.get(config.str('network', 'main'));

  // set fallback network configs from `uri` config if set
  let port = network.rpcPort,
    hostname = '127.0.0.1',
    protocol;

  const uri = config.str('node-uri');
  if (uri) {
    const nodeUrl = url.parse(uri);
    port = nodeUrl.port;
    hostname = nodeUrl.hostname;
    protocol = nodeUrl.protocol;
  }

  const ssl = config.bool('ssl') || protocol.indexOf('https') > -1;
  config.inject({ port, hostname, protocol, ssl });

  const nodeOptions = {
    uri: config.str('node-uri'),
    host: config.str('host', hostname),
    apiKey: config.str('api-key'),
    network: config.str('network', 'main'),
    port: config.uint('port'),
    ssl: config.bool('ssl'),
    protocol: config.str('protocol')
  };

  const walletOptions = {
    ...nodeOptions,
    uri: config.str('wallet-uri'),
    apiKey: config.str('wallet-api-key', nodeOptions.apiKey),
    port: config.uint('wallet-port', network.walletPort),
    ssl: config.bool('wallet-ssl', nodeOptions.ssl),
    token: config.str('wallet-token')
  };

  let walletClient, nodeClient;
  // check if config explicitly sets node config to `false`
  // if false, do not instantiate new node client
  if (config.bool('node', true)) {
    nodeClient = new NodeClient(nodeOptions);
    logger.info(
      `Configuring node client with uri: ${nodeOptions.host}:${
        nodeOptions.port
      }, network: ${nodeOptions.network}`
    );
  }

  // check if config explicitly sets wallet config to `false`
  // if false, do not instantiate new wallet client
  if (config.bool('wallet', true)) {
    walletClient = new WalletClient(walletOptions);
    logger.info(
      `Configuring wallet client with uri: ${walletOptions.host}:${
        walletOptions.port
      }, network: ${walletOptions.network}`
    );
  }

  return { nodeClient, walletClient };
};
