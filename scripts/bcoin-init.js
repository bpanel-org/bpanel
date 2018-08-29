/* eslint-disable no-console */

const bcoin = require('bcoin');
const fs = require('bfile');
const crypto = require('crypto');
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

    /***
     * Setup Configs
     ***/
    const config = new Config('bcoin');
    config.load({ env: true, argv: true, args: true });

    // can optionally pass in a custom config file name
    // in either the environment variables (prefaced with `BCOIN_`)
    // or as a command line argument
    const file = config.str('config', 'bcoin.conf');
    config.open(file);
    const network = bcoin.Network.get(config.str('network', 'main'));

    // set api key variables if none set in config
    if (!config.str('api-key'))
      config.inject({ apiKey: crypto.randomBytes(40).toString('hex') });

    // node-api-key is used by wallet server to connect to node
    if (!config.str('node-api-key')) {
      config.inject({ nodeApiKey: config.str('api-key') });
    }

    // admin token is used for wallet access
    if (!config.str('admin-token')) {
      config.inject({ adminToken: crypto.randomBytes(32).toString('hex') });
    }

    /***
     * Startup bcoin full node
     ***/
    node = new bcoin.FullNode({
      env: true,
      args: true,
      argv: true,
      config: true,
      apiKey: config.str('api-key'),
      network: config.str('network')
    });

    node.on('error', e => logger.error('There was a node error: ', e));
    logger.info(`Starting bcoin full node on ${config.str('network')} network`);

    await node.ensure();
    await node.open();
    await node.connect();
    node.startSync();
    logger.info('Starting node sync');

    /***
     * Start up a wallet node with bmultisig
     ***/
    let wallet;
    if (!config.bool('no-multisig', false)) {
      const WalletNode = bcoin.wallet.Node;
      const bmultisig = require('bmultisig');
      wallet = new WalletNode({
        config: true,
        argv: true,
        env: true,
        loader: require,
        apiKey: config.str('api-key'),
        walletAuth: config.str('wallet-auth'),
        nodeApiKey: config.str('node-api-key'),
        adminToken: config.str('admin-token'),
        plugins: [bmultisig]
      });
      wallet.on('error', e => logger.error('There was a wallet error: ', e));

      logger.info('Starting wallet server');
      await wallet.ensure();
      await wallet.open();
    }

    /***
     * Check if there is an init script and run it
     ***/
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

    /***
     * Setup client configs for bPanel:
     * Write and put configs in shared docker volume (`configs`)
     ***/
    const bpanelConfigDir = path.resolve(config.prefix, '.bpanel');
    const dockerConfig = path.resolve(bpanelConfigDir, 'clients/_docker.conf');
    if (!fs.existsSync(path.resolve(bpanelConfigDir, 'clients')))
      fs.mkdirSync(path.resolve(bpanelConfigDir, 'clients'));

    // run if there is no config
    // skip if a `reset-configs` config is set to false
    if (!fs.existsSync(dockerConfig) || config.bool('reset-configs', true)) {
      logger.info('Creating client config for bPanel: ', dockerConfig);

      const confText =
        `network: ${network.type}\n` +
        `api-key:${config.str('api-key')}\n` +
        `wallet-port:${network.walletPort}\n` +
        `wallet-api-key:${config.str('api-key')}\n` +
        `wallet-token:${config.str('admin-token')}`;

      fs.writeFileSync(dockerConfig, confText);
    }
  } catch (e) {
    logger.error(e.stack);
    node.close();
    process.exit(1);
  }
})();
