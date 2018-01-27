const bcoin = require('bcoin');
const consensus = bcoin.protocol.consensus;
const makeWallets = async node => {
  const blocks2Mine = process.env.BLOCKS_2_MINE
    ? process.env.BLOCKS_2_MINE
    : 10;
  const miner = node.miner;
  const chain = node.chain;

  consensus.COINBASE_MATURITY = 0;

  const wdb = node.require('walletdb').wdb;
  const primary = wdb.primary;

  primary.once('balance', async balance => {
    // eslint-disable-next-line no-console
    console.log('Primary gots some monies!', balance);
  });

  const minerReceive = await primary.receiveAddress();
  // eslint-disable-next-line no-console
  console.log('miner receive address: ', minerReceive);

  await miner.addAddress(minerReceive);
  let minedBlocks = 0;
  while (minedBlocks < blocks2Mine) {
    const entry = await chain.getEntry(node.chain.tip.hash);
    const block = await miner.mineBlock(entry, minerReceive);
    await node.chain.add(block);
    // eslint-disable-next-line no-console
    console.log('Block mined and added to chain: ', node.chain.tip.hash);
    minedBlocks++;
  }
};

module.exports = makeWallets;
