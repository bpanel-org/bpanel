#!/usr/bin/env node
// bPanel server -- A Blockchain Management System
// --watch Watch webapp
// --watch-poll Watch webapp in docker on a Mac
// --dev Watch server and webapp

const path = require('path');
const fs = require('bfile');
const { execSync } = require('child_process');
const assert = require('bsert');
const os = require('os');
const Config = require('bcfg');
const logger = require('./logger');
const Blgr = require('blgr');

const webpackArgs = [];

let poll = false;
// If run from command line, parse args
if (require.main === module) {
  // setting up webpack configs
  // use default/base config for dev
  if (
    process.argv.indexOf('--dev') >= 0 ||
    process.env.NODE_ENV === 'development'
  ) {
    webpackArgs.push(
      '--config',
      path.resolve(__dirname, '../configs/webpack.config.js')
    );
  } else {
    // otherwise use prod config
    webpackArgs.push(
      '--config',
      path.resolve(__dirname, '../configs/webpack.prod.js')
    );
  }

  // environment specific `watch` args
  if (process.argv.indexOf('--watch-poll') >= 0) {
    poll = true;
    webpackArgs.push('--watch', '--env.dev', '--env.poll');
  } else if (process.argv.indexOf('--watch') >= 0) {
    webpackArgs.push('--watch', '--env.dev');
  }

  // an option to run an `npm install` which will clear any symlinks
  if (process.argv.indexOf('--clear') > -1) {
    logger.info('Clearing symlinks in node_modules with `npm install`...');
    execSync('npm install', {
      killSignal: 'SIGINT',
      stdio: [0, 1, 2],
      cwd: path.resolve(__dirname, '..')
    });
  }

  if (process.argv.indexOf('--dev') >= 0) {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

    // pass args to nodemon process except `--dev`
    const args = process.argv
      .slice(2)
      .filter(arg => arg !== '--dev' && arg !== '--clear');

    // Watch this server
    const nodemon = require('nodemon')({
      script: 'server/index.js',
      watch: ['server'],
      ignore: ['server/test/**/*.js'],
      args,
      legacyWatch: poll,
      ext: 'js'
    })
      .on('crash', () => {
        process.exit(1);
      })
      .on('quit', process.exit);

    // need to use chokidar to watch for changes outside the working
    // directory. Will restart if configs get updated
    const clientsDir = path.resolve(os.homedir(), '.bpanel/clients');
    require('chokidar')
      .watch(clientsDir, { usePolling: poll, useFsEvents: poll })
      .on('all', () => {
        nodemon.emit('restart');
      });
    return;
  }
}

// Init bPanel
module.exports = async (_config = {}) => {
  // Import server dependencies
  const path = require('path');
  const http = require('http');
  const express = require('express');

  // Import express middlewares
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const compression = require('compression');

  // Import app server utilities and modules
  const logger = require('./logger');
  const SocketManager = require('./socketManager');
  const clientFactory = require('./clientFactory');
  const clientRoutes = require('./clientRoutes');

  // get bpanel config
  const bpanelConfig = new Config('bpanel');

  // inject any custom configs passed
  bpanelConfig.inject(_config);

  // load configs from environment
  bpanelConfig.load({ env: true, argv: true, arg: true });

  // check if vendor-manifest has been built otherwise run
  // build:dll first to build the manifest
  if (!fs.existsSync(path.resolve(__dirname, '../dist/vendor-manifest.json'))) {
    logger.info(
      'No vendor manifest. Running webpack dll first. This can take a couple minutes the first time but \
will increase speed of future builds, so please be patient.'
    );
    execSync('npm run build:dll', {
      stdio: [0, 1, 2],
      cwd: path.resolve(__dirname, '..')
    });
  }

  // Always start webpack
  require('nodemon')({
    script: './node_modules/.bin/webpack',
    watch: [`${bpanelConfig.prefix}/config.js`],
    env: {
      BPANEL_PREFIX: bpanelConfig.prefix
    },
    args: webpackArgs,
    legacyWatch: poll
  })
    .on('crash', () => {
      process.exit(1);
    })
    .on('quit', process.exit);

  // Set up client config
  // loadConfigs uses the bpanelConfig to find the clients and build
  // each of their configs. Then we filter for the config that matches
  // the one passed via `client-id`
  const clientConfigs = require('./loadConfigs')(bpanelConfig);

  assert(
    clientConfigs.length,
    'There was a problem loading client configs. \
Visit the documentation for more information: https://bpanel.org/docs/configuration.html'
  );

  let clientConfig = clientConfigs.find(
    cfg => cfg.str('id') === bpanelConfig.str('client-id', 'default')
  );

  if (!clientConfig) {
    logger.error(
      `Could not find config for ${bpanelConfig.str(
        'client-id'
      )}. Will set to 'default' instead.`
    );
    clientConfig = clientConfigs.find(cfg => cfg.str('id') === 'default');
    if (!clientConfig) {
      logger.warn('Could not find default client config.');
      clientConfig = clientConfigs[0];
      logger.warn(`Setting fallback to ${clientConfig.str('id')}.`);
    }
  }

  // save reference to the id for redirects
  const clientId = clientConfig.str('id');

  // create clients
  const { nodeClient, walletClient, multisigWalletClient } = clientFactory(
    clientConfig
  );

  const clients = clientConfigs.reduce((clientsMap, cfg) => {
    const id = cfg.str('id');
    assert(id, 'client config must have id');
    clientsMap.set(id, { ...clientFactory(cfg), config: cfg });
    return clientsMap;
  }, new Map());

  // Init app express server
  const app = express.Router();
  const port = process.env.PORT || 5000;
  const bsockPort = process.env.BSOCK_PORT || 8000;
  app.use(bodyParser.json());
  app.use(cors());

  // create new SocketManager
  // TODO: consolidate to single logger using blgr and remove other dependency
  const blgr = new Blgr({
    level: 'info'
  });
  await blgr.open();
  const socketManager = new SocketManager({
    noAuth: true,
    port: bsockPort,
    logger: blgr
  });

  // Wait for async part of server setup
  const ready = (async function() {
    // Setup bsock server
    // socket.io is the default path
    socketManager.addClients('socket.io', {
      node: nodeClient,
      wallet: walletClient,
      multisig: multisigWalletClient
    });

    const clientIds = clients.keys();
    for (let id of clientIds) {
      socketManager.addClients(id, {
        node: clients.get(id).nodeClient,
        wallet: clients.get(id).walletClient,
        multisig: clients.get(id).multisigWalletClient
      });
    }

    // Setup app server
    app.use(compression());
    app.use(
      express.static(path.resolve(__dirname, '../dist'), {
        index: 'index.html',
        setHeaders: function(res, path) {
          if (path.endsWith('.gz')) {
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Content-Type', 'application/javascript');
          }
        }
      })
    );

    const resolveIndex = (req, res) => {
      logger.debug(`Caught request in resolveIndex: ${req.path}`);
      res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    };
    app.get('/', resolveIndex);

    // route to get server info
    const { ssl, host, port: clientPort } = nodeClient;

    const uri = clientConfig.str(
      'node-uri',
      `${ssl ? 'https' : 'http'}://${host}:${clientPort}`
    );
    app.get('/server', (req, res) => res.status(200).send({ bcoinUri: uri }));

    app.use('/clients', clientRoutes(clients, clientId));

    // redirects to support old routes
    app.use('/bcoin', (req, res) =>
      res.redirect(307, `/clients/${clientId}/node${req.path}`)
    );

    app.use('/bwallet', (req, res) =>
      res.redirect(307, `/clients/${clientId}/wallet${req.path}`)
    );

    app.use('/multisig', (req, res) =>
      res.redirect(307, `/clients/${clientId}/multisig${req.path}`)
    );

    // TODO: add favicon.ico file
    app.get('/favicon.ico', (req, res) => {
      res.send();
    });

    app.get('/*', resolveIndex);

    // handle the unhandled rejections and exceptions
    if (process.listenerCount('unhandledRejection') === 0) {
      process.on('unhandledRejection', err => {
        logger.error('Unhandled Rejection\n', err);
      });
    }
    if (process.listenerCount('uncaughtException') === 0) {
      process.on('uncaughtException', err => {
        logger.error('Uncaught Exception\n', err);
      });
    }

    // Crash the process when a service does
    const onError = service => {
      return e => {
        logger.error(`${service} error: ${e.message}`);
        process.exit(1);
      };
    };

    // Start bsock server
    socketManager.on('error', e =>
      logger.error(`socketManager error: ${e.message}`)
    );
    await socketManager.open();

    // If NOT required from another script...
    if (require.main === module) {
      http // Start app server
        .createServer(express().use(app))
        .on('error', onError('bpanel'))
        .listen(port, () => {
          logger.info('bpanel app running on port', port);
        });

      // can serve over https
      if (bpanelConfig.bool('ssl', false)) {
        const fs = require('bfile');
        const https = require('https');
        const httpsPort = bpanelConfig.int('https-port', 5001);
        const keyPath = bpanelConfig.str('ssl-key', '/etc/ssl/key.pem');
        const certPath = bpanelConfig.str('ssl-cert', '/etc/ssl/cert.pem');

        let opts = {};
        try {
          opts.key = fs.readFileSync(keyPath);
          opts.cert = fs.readFileSync(certPath);
        } catch (e) {
          logger.error(e);
          logger.error('Error reading cert/key pair');
          process.exit(1);
        }

        https
          .createServer(opts, express().use(app))
          .on('error', onError('bpanel'))
          .listen(httpsPort, () => {
            logger.info('bpanel https app running on port', httpsPort);
          });
      }
    }

    return app;
  })();

  // Export app, clients, & utils
  return {
    app,
    ready,
    logger,
    nodeClient,
    walletClient
  };
};

// Start server when run from command line
if (require.main === module) {
  try {
    module.exports();
  } catch (e) {
    logger.error('There was an error running the server: ', e.stack);
    process.exit(1);
  }
}
