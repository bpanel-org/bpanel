const bcoin = require('bcoin');
const assert = require('bsert');

const consensus = bcoin.protocol.consensus;

const makeWallets = async (node, config, wallet) => {
  const network = node.network.type;
  assert(
    network !== 'main' && network !== 'testnet',
    `You probably don't want to be running the miner on the ${network} network`
  );

  const blocks2Mine = process.env.BLOCKS_2_MINE
    ? process.env.BLOCKS_2_MINE
    : 10;
  const miner = node.miner;
  const chain = node.chain;

  // don't run if already have enough blocks
  if (chain.height > blocks2Mine) return;

  consensus.COINBASE_MATURITY = 0;
  let wdb;

  if (wallet) wdb = wallet.wdb;
  else wdb = node.require('walletdb').wdb;

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
