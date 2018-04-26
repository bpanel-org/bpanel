const { NodeClient, WalletClient } = require('bclient');
const logger = require('./logger');

module.exports = config => {
  config.port = parseInt(config.port);
  const walletConfig = {
    host: config.host,
    apiKey: config.apiKey,
    network: config.network,
    port: parseInt(config.walletPort)
  };
  if (config.port == 443 || config.protocol.indexOf('https') == 0) {
    walletConfig.ssl = true;
    logger.info('wallet client using ssl');
  }

  let walletClient, nodeClient;
  if (config.port) {
    nodeClient = new NodeClient(config);
    logger.info(
      `Configuring node client with uri: ${config.host}:${
        config.port
      }, network: ${config.network}`
    );
  }
  if (config.walletPort) {
    walletClient = new WalletClient(walletConfig);
    logger.info(
      `Configuring wallet client with uri: ${walletConfig.host}:${
        walletConfig.port
      }, network: ${walletConfig.network}`
    );
  }

  return { nodeClient, walletClient };
};
