const { NodeClient, WalletClient } = require('bclient');

module.exports = config => {
  config.port = parseInt(config.port);
  const walletConfig = {
    host: config.host,
    apiKey: config.apiKey,
    network: config.network,
    port: parseInt(config.walletPort)
  };
  if (config.port == 443 || config.protocol.indexOf('https') == 0)
    walletConfig.ssl = true;

  let walletClient, nodeClient;
  if (config.port) nodeClient = new NodeClient(config);
  if (config.walletPort) walletClient = new WalletClient(walletConfig);

  return { nodeClient, walletClient };
};
