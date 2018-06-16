const { WalletClient } = require('bclient');
const blgr = require('blgr');
const { Network } = require('bcoin');

// setup coinbase addresses for miner
// must be done at runtime, otherwise a
// potential security problem
module.exports = async (node, config) => {
  const logger = new blgr({
    level: 'info'
  });
  await logger.open();
  const network = Network.get(config.str('network', 'main'));
  const walletClient = new WalletClient({
    port: config.int('wallet-port', network.walletPort),
    apiKey: config.str('api-key'),
    token: config.str('admin-token')
  });

  // allow for runtime configuration of which
  // address to use for coinbase transactions
  // TODO: come up with generalized way to pass args to runtime scripts
  const COINBASE_WALLET_ID = config.str('coinbase-wallet-id', 'primary');
  const COINBASE_ACCOUNT_ID = config.str('coinbase-account-id', 'default');

  logger.info('Fetching coinbase address');
  const { receiveAddress } = await walletClient.getAccount(
    COINBASE_WALLET_ID,
    COINBASE_ACCOUNT_ID
  );

  await node.miner.addAddress(receiveAddress);
  logger.info(`Set miner coinbase address: ${receiveAddress}`);
};
