/* eslint-disable no-console */

const bcoin = require('bcoin');
const fs = require('fs');
const path = require('path');
const os = require('os');
const blgr = require('blgr');

// global variables
let logger;
let node;

(async () => {
  try {
    logger = new blgr({
      level: 'debug'
    });
    await logger.open();
    logger.info('LOGGER OPEN');

    let prefix = process.env.prefix
      ? process.env.prefix
      : `${os.homedir()}/.bcoin/`;
    const initScript = process.env.BCOIN_INIT_SCRIPT;

    prefix = prefix.replace('~', os.homedir());
    // create the node with our custom configs
    node = new bcoin.FullNode({ env: true });
    logger.info('Starting bcoin.FullNode({ env: true })');

    node.on('error', e => logger.error('There was an error: ', e));

    await node.ensure();
    await node.open();
    await node.connect();
    node.startSync();
    logger.info('Starting node sync');

    if (!!initScript) {
      logger.info(`Running init script ${initScript} now to setup environment`);
      await require(path.resolve(__dirname, initScript))(node);
    }
  } catch (e) {
    logger.error(e.stack);
    node.close();
    process.exit(1);
  }
})();
