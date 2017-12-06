const bcoin = require('bcoin');
const consensus = bcoin.protocol.consensus;
const makeWallets = async node => {
  const miner = node.miner;
  const chain = node.chain;

  consensus.COINBASE_MATURITY = 0;

  const wdb = node.require('walletdb');
  await wdb.open();
  const primary = wdb.primary;

  primary.once('balance', async balance => {
    // eslint-disable-next-line no-console
    console.log('Primary gots some monies!', balance);
  });

  const minerReceive = primary.getReceive();
  // eslint-disable-next-line no-console
  console.log('minerReceive: ', minerReceive);

  await miner.addAddress(minerReceive);

  const entry = await chain.getEntry(node.chain.tip.hash);
  const block = await node.miner.mineBlock(entry, minerReceive);

  await node.chain.add(block);
};

module.exports = makeWallets;
