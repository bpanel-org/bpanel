const { protocol: { consensus } } = require('bcoin');

module.exports = async (node, config, logger, wallet) => {
  consensus.COINBASE_MATURITY = 0;

  const miner = node.miner;
  const chain = node.chain;
  const network = node.network;
  const feeRate = network.minRelay * 10; // for some reason bc segwit??!!
  const wdb = wallet.wdb;

  const numInitBlocks = 144 * 3; // Initial blocks mined to activate SegWit.
  // Miner primary/default then evenly disperses
  // all funds to other wallet accounts

  const numTxBlocks = 10; // How many blocks to randomly fill with txs
  const numTxPerBlock = 10; // How many txs to try to put in each block
  // (due to the random tx-generation, some txs will fail due to lack of funds)

  const maxOutputsPerTx = 4; // Each tx will have a random # of outputs
  const minSend = 50000; // Each tx output will have a random value
  const maxSend = 100000;

  // We are going to bend time, and start our blockchain in the past!
  let virtualNow = network.now() - 60 * 10 * (numInitBlocks + numTxBlocks + 1);
  const blockInterval = 60 * 10; // ten minutes

  const walletNames = [
    'Powell',
    'Yellen',
    'Bernanke',
    'Greenspan',
    'Volcker',
    'Miller',
    'Burns',
    'Martin',
    'McCabe',
    'Eccles'
  ];

  const accountNames = ['hot', 'cold'];

  const wallets = [];

  const mineRegtestBlock = async function(coinbaseAddr) {
    const entry = await chain.getEntry(node.chain.tip.hash);
    const block = await miner.mineBlock(entry, coinbaseAddr);
    await node.chain.add(block);
  };

  const mineRegtestBlockToPast = async function(coinbaseAddr) {
    const entry = await chain.getEntry(node.chain.tip.hash);
    const job = await miner.createJob(entry, coinbaseAddr);
    job.attempt.time = virtualNow;
    virtualNow += blockInterval;
    job.refresh();
    const block = await job.mineAsync();
    await node.chain.add(block);
  };

  logger.info('Creating wallets and accounts...');
  for (const wName of walletNames) {
    try {
      const newWallet = await wdb.create({
        id: wName,
        witness: Math.random() < 0.5
      });

      wallets.push(newWallet);

      for (const aName of accountNames) {
        await newWallet.createAccount({
          name: aName,
          witness: Math.random() < 0.5
        });
      }
    } catch (e) {
      logger.error(`Error creating wallet ${wName}:`, e.message);
    }
  }

  if (!wallets.length) {
    logger.info('No wallets created, likely this script has already been run');
    return;
  }
  accountNames.push('default');

  logger.info('Mining initial blocks...');
  const primary = wdb.primary;
  const minerReceive = await primary.receiveAddress();
  await miner.addAddress(minerReceive);
  for (let i = 0; i < numInitBlocks; i++) {
    await mineRegtestBlockToPast(minerReceive);
  }

  logger.info('Ensure wallet is caught up before proceeding...');
  await wdb.rescan(0);

  logger.info('Air-dropping funds to the people...');
  const balance = await primary.getBalance(0);

  const totalAmt = balance.confirmed;
  const amtPerAcct = Math.floor(
    totalAmt / (walletNames.length * accountNames.length)
  );
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

  await primary.send({
    outputs: outputs,
    rate: feeRate,
    subtractFee: true
  });

  logger.info('Confirming airdrop...');
  await mineRegtestBlockToPast(minerReceive);

  logger.info('Creating a big mess!...');
  for (let b = 0; b < numTxBlocks; b++) {
    for (let t = 0; t < numTxPerBlock; t++) {
      // Randomly select recipients for this tx
      const outputs = [];
      const numOutputs = Math.floor(Math.random() * maxOutputsPerTx) + 1;
      for (let o = 0; o < numOutputs; o++) {
        const recWallet = wallets[Math.floor(Math.random() * wallets.length)];
        const recAcct =
          accountNames[Math.floor(Math.random() * wallets.length)];

        const recAddr = await recWallet.receiveAddress(recAcct);
        const value = Math.floor(
          Math.random() * (maxSend - minSend) + minSend / numOutputs
        );
        outputs.push({
          value: value,
          address: recAddr
        });
      }

      // Randomly choose a sender for this tx
      const sendWallet = wallets[Math.floor(Math.random() * wallets.length)];
      const sendAcct = accountNames[Math.floor(Math.random() * wallets.length)];
      try {
        const tx = await sendWallet.send({
          account: sendAcct,
          outputs: outputs,
          rate: feeRate,
          subtractFee: true
        });
      } catch (e) {
        logger.error(`Problem sending tx: ${e}`);
      }
    }

    // CONFIRM
    await mineRegtestBlockToPast(minerReceive);
  }

  logger.info('All done! Go play.');
};
