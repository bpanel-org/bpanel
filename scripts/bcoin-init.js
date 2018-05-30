/* eslint-disable no-console */

const bcoin = require('bcoin');
const fs = require('fs');
const path = require('path');
const blgr = require('blgr');

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

    // create the node with our custom configs
    // the env option will pull options from the environment
    // which is set in docker-compose.yml
    node = new bcoin.FullNode({ env: true });
    logger.info('node:', node.config);
    logger.info('Starting bcoin.FullNode({ env: true })');

    node.on('error', e => logger.error('There was an error: ', e));

    await node.ensure();
    await node.open();
    await node.connect();
    node.startSync();
    logger.info('Starting node sync');

    const initScript = process.env.BCOIN_INIT_SCRIPT;
    const initScriptFilePath = path.resolve(__dirname, initScript);
    const initScriptExists = fs.existsSync(initScriptFilePath);
    if (!!initScript && initScriptExists) {
      logger.info(
        `Running init script ${initScriptFilePath} now to setup environment`
      );
      await require(initScriptFilePath)(node);
    }
  } catch (e) {
    logger.error(e.stack);
    node.close();
    process.exit(1);
  }
})();
