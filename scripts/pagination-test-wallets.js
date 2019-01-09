const { protocol: { consensus } } = require('bcoin');

module.exports = async (node, config, logger, wallet) => {
  consensus.COINBASE_MATURITY = 0;

  const miner = node.miner;
  const chain = node.chain;
  const network = node.network;
  const feeRate = network.minRelay;
  const wdb = wallet.wdb;

  const numBlocks = 1;

  const walletNames = [
    'Mark',
    'Buck',
    'Zip',
    'Darren',
    'Nodar',
    'Javed',
    'Boyma',
    'Stephen',
    'Andrew',
    'JJ'
  ];

  const accountNames = [
    'candy',
    'games',
    'rent',
    'clothes',
    'food',
    'taxes',
    'furniture',
    'travel',
    'gifts'
  ];

  const wallets = [];

  logger.info('Creating wallets and accounts...');
  for (const wName of walletNames) {
    const newWallet = await wdb.create({
      id: wName,
      witness: Math.random() < 0.5
    });

    wallets.push(newWallet);

    for (const aName of accountNames) {
      await newWallet.createAccount({
        name: aName
      });
    }
  }
  accountNames.push('default');

  logger.info('Mining blocks...');
  const primary = wdb.primary;
  const minerReceive = await primary.receiveAddress();
  await miner.addAddress(minerReceive);
  for (let i = 0; i < numBlocks; i++) {
    const entry = await chain.getEntry(node.chain.tip.hash);
    const block = await miner.mineBlock(entry, minerReceive);
    await node.chain.add(block);
  }

  logger.info('Ensure wallet is caught up before proceeding...');
  await wdb.rescan(0);

  logger.info('Air-dropping funds to the people...');
  const balance = await primary.getBalance(0);

  const totalAmt = balance.confirmed;
  const amtPerAcct = totalAmt / (walletNames.length * accountNames.length);
  console.log('1', balance, totalAmt, amtPerAcct);

  const outputs = [];
  for (const wallet of wallets) {
    for (const aName of accountNames) {
      const recAddr = await wallet.receiveAddress(aName);
      outputs.push({
        value: amtPerAcct,
        address: recAddr
      });
    }
  }

  console.log('2', balance, totalAmt, amtPerAcct);

  await primary.send({
    outputs: outputs,
    rate: feeRate,
    subtractFee: true
  });

  logger.info('Confirming airdrop...');
  {
    const entry = await chain.getEntry(node.chain.tip.hash);
    const block = await miner.mineBlock(entry, minerReceive);
    await node.chain.add(block);
  }
};
