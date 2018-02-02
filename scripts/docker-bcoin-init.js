/* eslint-disable no-console */

const bcoin = require('bcoin');
const fs = require('fs');
const path = require('path');
const os = require('os');

const configs = require(path.resolve(
  __dirname,
  '../configs/bcoin.config.json'
));
const {
  initScript,
  apiKey,
  httpHost,
  logLevel,
  workers,
  prune,
  network,
  memory,
  uri
} = configs;

let prefix = configs.prefix ? configs.prefix : `${os.homedir()}/.bcoin/`;
prefix = prefix.replace('~', os.homedir());
// create the node with our custom configs
const node = new bcoin.FullNode({
  apiKey,
  httpHost,
  logLevel,
  workers,
  network,
  uri,
  memory,
  env: true,
  prune,
  prefix
});
// checking if walletdb dir already exists (i.e. was mounted as volume)
// need to do before using plugin because that will create the dir
// if not already there
const fileList = fs.existsSync(prefix) ? fs.readdirSync(prefix) : [];
const hadWalletDB = fileList.indexOf('wallet') > -1;

if (!node.config.bool('no-wallet') && !node.has('walletdb')) {
  const walletPlugin = bcoin.wallet.plugin;
  node.use(walletPlugin);
}

(async () => {
  await node.ensure();
  await node.open();
  await node.connect();
  node.startSync();
})()
  .then(async () => {
    // check if the walletdb exists before running script
    console.log('bcoin node is started');
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
