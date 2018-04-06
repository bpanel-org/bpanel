/* eslint-disable no-console */

const bcoin = require('bcoin');
const fs = require('fs');
const path = require('path');
const os = require('os');

let prefix = process.env.prefix
  ? process.env.prefix
  : `${os.homedir()}/.bcoin/`;
const initScript = process.env.BCOIN_INIT_SCRIPT;

prefix = prefix.replace('~', os.homedir());
// create the node with our custom configs
const node = new bcoin.FullNode({ env: true });

// checking if walletdb dir already exists (i.e. was mounted as volume)
// need to do before using plugin because that will create the dir
// if not already there
const fileList = fs.existsSync(prefix) ? fs.readdirSync(prefix) : [];
const hadWalletDB = fileList.indexOf('wallet') > -1;

if (!node.config.bool('no-wallet') && !node.has('walletdb')) {
  const walletPlugin = bcoin.wallet.plugin;
  node.use(walletPlugin);
}

node.on('error', e => console.error('There was an error: ', e));

(async () => {
  await node.ensure();
  await node.open();
  await node.connect();
  node.startSync();
})()
  .then(async () => {
    console.log('bcoin node is started');
    // want to set a coinbase address in case of mining
    const wdb = node.require('walletdb').wdb;
    const primary = wdb.primary;
    const coinbase1 = await primary.receiveAddress();
    const coinbase2 = await primary.receiveAddress();
    await node.miner.addAddress(coinbase1);
    await node.miner.addAddress(coinbase2);

    // check if the walletdb exists before running script
    if (!hadWalletDB && !!initScript) {
      console.log('No walletdb detected.');
      console.log(`Running init script ${initScript} now to setup environment`);
      await require(path.resolve(__dirname, initScript))(node);
    }
  })
  .catch(err => {
    console.error(err.stack);
    node.close();
    process.exit(1);
  });
