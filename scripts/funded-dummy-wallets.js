const bcoin = require('bcoin');
const consensus = bcoin.protocol.consensus;
const Miner = bcoin.miner;
const makeWallets = async node => {
  const miner = node.miner;
  const chain = node.chain;

  consensus.COINBASE_MATURITY = 0;

  const wdb = node.require('walletdb');
  await wdb.open();
  const primary = wdb.primary;

  primary.once('balance', async balance => {
    console.log('Primary gots some monies!', balance);
  });

  const minerReceive = primary.getReceive();
  console.log('minerReceive: ', minerReceive);

  await miner.addAddress(minerReceive);

  const tip = node.chain.tip;
  const job = await node.miner.createJob(tip);
  const entry = await node.chain.getEntry(node.chain.tip.hash);
  const block = await node.miner.mineBlock(entry, minerReceive);

  await node.chain.add(block);
};

module.exports = makeWallets;
