const { protocol: { consensus } } = require('bcoin');

module.exports = async (node, config, logger, wallet) => {
  consensus.COINBASE_MATURITY = 0;

  const miner = node.miner;
  const chain = node.chain;
  const network = node.network;
  const feeRate = network.minRelay * 10; // for some reason bc segwit??!!
  const wdb = wallet.wdb;

  const numInitBlocks = 144 * 3; //. to activate segwit
  const numTxBlocks = 10;
  const numTxPerBlock = 10;
  const maxOutputsPerTx = 4;
  const minSend = 50000;
  const maxSend = 100000;

  // We are going to bend time, and start our blockchain in the past!
  let virtualNow = network.now() - 60 * 10 * (numInitBlocks + numTxBlocks + 1);
  const blockInterval = 60 * 10; // ten mimnutes

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
      // TO
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

      // FROM
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
