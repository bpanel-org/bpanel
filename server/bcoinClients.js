const { NodeClient, WalletClient } = require('bclient');

module.exports = config => {
  config.port = parseInt(config.port);
  const walletConfig = {
    host: config.host,
    port: config.port,
    apiKey: config.apiKey,
    network: config.network
  };
  if (config.port == 443 || (config.uri && config.uri.indexOf('https') > -1))
    walletConfig.ssl = true;

  let walletClient, nodeClient;
  if (config.port) nodeClient = new NodeClient(config);
  if (config.walletPort) {
    walletClient = new WalletClient({
      ...walletConfig,
      port: parseInt(config.walletPort)
    });
  }

  return { nodeClient, walletClient };
};
