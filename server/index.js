#!/usr/bin/env node
// bPanel server -- A Blockchain Management System
// --watch Watch webapp
// --watch-poll Watch webapp in docker on a Mac
// --dev Watch server and webapp

const path = require('path');
const os = require('os');
const Config = require('bcfg');

const webpackArgs = [
  '--config',
  path.resolve(__dirname, '../webpack.config.js')
];

let poll = false;
// If run from command line, parse args
if (require.main === module) {
  if (process.argv.indexOf('--watch-poll') >= 0) {
    poll = true;
    webpackArgs.push('--watch', '--env.dev', '--env.poll');
  } else if (process.argv.indexOf('--watch') >= 0) {
    webpackArgs.push('--watch', '--env.dev');
  }
  if (process.argv.indexOf('--dev') >= 0) {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

    // pass args to nodemon process except `--dev`
    const args = process.argv.slice(2).filter(arg => arg !== '--dev');

    // Watch this server
    const nodemon = require('nodemon')({
      script: 'server/index.js',
      watch: ['server'],
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
module.exports = (_config = {}) => {
  // Import server dependencies
  const path = require('path');
  const http = require('http');
  const express = require('express');
  const bsock = require('bsock').createServer();

  // Import express middlewares
  const bodyParser = require('body-parser');
  const cors = require('cors');

  // Import app server utilities and modules
  const logger = require('./logger');
  const bcoinRouter = require('./bcoinRouter');
  const socketHandler = require('./bcoinSocket');

  // get bpanel config
  const bpanelConfig = new Config('bpanel');

  // inject any custom configs passed
  bpanelConfig.inject(_config);

  // load configs from environment
  bpanelConfig.load({ env: true, argv: true, arg: true });

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
  let clientConfig = require('./loadConfigs')(bpanelConfig).find(
    cfg => cfg.str('id') === bpanelConfig.str('client-id', 'default')
  );

  // create clients
  const {
    nodeClient,
    walletClient,
    multisigWalletClient
  } = require('./bcoinClients')(clientConfig);

  // Init bsock socket server
  const socketHttpServer = http.createServer();
  bsock.attach(socketHttpServer);

  // Init app express server
  const app = express.Router();
  const port = process.env.PORT || 5000;
  const bsockPort = process.env.BSOCK_PORT || 8000;
  app.use(bodyParser.json());
  app.use(cors());

  // Wait for async part of server setup
  const ready = (async function() {
    // Setup bsock server
    try {
      if (nodeClient) {
        await nodeClient.open();
      }
      if (walletClient) {
        await walletClient.open();
      }
      if (multisigWalletClient) {
        await multisigWalletClient.open();
      }
    } catch (err) {
      logger.error('Error connecting sockets: ', err);
    }

    bsock.on(
      'socket',
      socketHandler(nodeClient, walletClient, multisigWalletClient)
    );

    // Setup app server
    app.use(
      express.static(path.resolve(__dirname, '../dist'), {
        setHeaders: function(res, path) {
          if (path.endsWith('/main.bundle.js.gz')) {
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Content-Type', 'application/javascript');
          }
        }
      })
    );

    const resolveIndex = (req, res) => {
      logger.debug(`Caught request in resolveIndex: ${req.path}`);
      res.sendFile(path.resolve(__dirname, '../webapp/index.html'));
    };
    app.get('/', resolveIndex);

    // route to get server info
    const { ssl, host, port: clientPort } = nodeClient;

    const uri = clientConfig.str(
      'node-uri',
      `${ssl ? 'https' : 'http'}://${host}:${clientPort}`
    );
    app.get('/server', (req, res) => res.status(200).send({ bcoinUri: uri }));

    if (nodeClient) {
      logger.info(`Connecting with ${clientConfig.str('client-id')} client`);
      app.use('/bcoin', bcoinRouter(nodeClient));
    }

    if (walletClient) {
      app.use('/bwallet', bcoinRouter(walletClient));
    }

    if (multisigWalletClient) {
      app.use('/multisig', bcoinRouter(multisigWalletClient));
    }

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
    socketHttpServer.on('error', onError('bsock'));
    socketHttpServer.listen(bsockPort, () => {
      logger.info('bsock running on port', bsockPort);
    });

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
        const fs = require('fs');
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

// Start server when ran from command line
if (require.main === module) {
  module.exports();
}
