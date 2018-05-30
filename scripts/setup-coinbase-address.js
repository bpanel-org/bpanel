const { WalletClient } = require('bclient');
const blgr = require('blgr');
const assert = require('assert');

// setup coinbase addresses for miner
// must be done at runtime, otherwise a
// potential security problem
module.exports = async node => {
  const logger = new blgr({
    level: 'info'
  });
  await logger.open();
  const port = parseInt(process.env.BCOIN_WALLET_PORT, 10);
  const apiKey = process.env.BCOIN_API_KEY;

  // port will be NaN if it was undefined
  assert(!!port, `${process.argv[0]} requires BCOIN_WALLET_PORT to be set`);
  assert(
    apiKey !== undefined,
    `${process.argv[0]} requires BCOIN_API_KEY to be set`
  );

  const walletClient = new WalletClient({ port, apiKey });

  // allow for runtime configuration of which
  // address to use for coinbase transactions
  // TODO: come up with generalized way to pass args to runtime scripts
  const COINBASE_WALLET_ID = process.env.BPANEL_COINBASE_WALLET_ID || 'primary';
  const COINBASE_ACCOUNT_ID =
    process.env.BPANEL_COINBASE_ACCOUNT_ID || 'default';

  const wallet = walletClient.wallet(COINBASE_WALLET_ID);
  logger.info('Fetching coinbase address');
  const { receiveAddress } = await wallet.getAccount(COINBASE_ACCOUNT_ID);

  await node.miner.addAddress(receiveAddress);
  logger.info(`Set miner coinbase address: ${receiveAddress}`);
};
