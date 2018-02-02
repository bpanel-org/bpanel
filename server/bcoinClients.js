const path = require('path');
const { NodeClient, WalletClient } = require('bclient');

const config = require(path.resolve(__dirname, '../configs/bcoin.config.json'));
const { network, port, apiKey, host, walletPort } = config;
const configs = {
  apiKey,
  network,
  host,
  port: typeof port === 'number' ? port : parseInt(port)
};

const nodeClient = new NodeClient(configs);
const walletClient = new WalletClient({
  ...configs,
  port: typeof walletPort === 'number' ? walletPort : parseInt(walletPort)
});

module.exports = { nodeClient, walletClient };
