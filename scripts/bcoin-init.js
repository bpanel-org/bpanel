/* eslint-disable no-console */

const bcoin = require('bcoin');
const fs = require('fs');
const path = require('path');
const blgr = require('blgr');
const Config = require('bcfg');

// global variables
let logger;
let node;

(async () => {
  try {
    logger = new blgr({
      level: 'info'
    });
    await logger.open();
    logger.info('LOGGER OPEN');

    const config = new Config('bcoin');
    config.load({ env: true, argv: true });

    // can optionally pass in a custom config file name
    // in either the environment variables (prefaced with `BCOIN_`)
    // or as a command line argument
    const file = config.str('config', 'bcoin.conf');
    config.open(file);

    node = new bcoin.FullNode({
      env: true,
      args: true,
      config: true,
      network: config.str('network')
    });

    logger.info(`Starting bcoin Full Node on ${config.str('network')} network`);

    node.on('error', e => logger.error('There was an error: ', e));

    await node.ensure();
    await node.open();
    await node.connect();
    node.startSync();
    logger.info('Starting node sync');

    const initScript = config.str('init-script');

    const initScriptFilePath =
      initScript && path.resolve(__dirname, initScript);
    const initScriptExists = fs.existsSync(initScriptFilePath);
    if (!!initScript && initScriptExists) {
      logger.info(
        `Running init script ${initScriptFilePath} now to setup environment`
      );
      // pass running node and config object
      // so script can interact with the node
      await require(initScriptFilePath)(node, config);
    }
  } catch (e) {
    logger.error(e.stack);
    node.close();
    process.exit(1);
  }
})();
