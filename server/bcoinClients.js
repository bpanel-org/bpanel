const path = require('path');
const { NodeClient } = require('bclient');

const config = require(path.resolve(__dirname, '../configs/bcoin.config.json'));
const { network, port, apiKey, host } = config;
const nodeClient = new NodeClient({
  apiKey,
  network,
  host,
  port: typeof port === 'number' ? port : parseInt(port)
});

module.exports = { nodeClient };
