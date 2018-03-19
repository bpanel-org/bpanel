#!/usr/bin/env node
// Bpanel server -- The bcoin UI
// --watch Watch webapp
// --watch-poll Watch webapp in docker on a Mac
// --dev Watch server and webapp
// --no-save-config Don't turn ENV into config

let poll = false;
const webpackArgs = [];

// If run from command line, parse args
if (require.main === module) {
  if (process.argv.indexOf('--no-save-config') < 0) {
    // Turn env into config and save
    require('./saveConfig.js');
  }
  if (process.argv.indexOf('--watch-poll') >= 0) {
    poll = true;
    webpackArgs.push('--watch-poll', '--watch');
  } else if (process.argv.indexOf('--watch') >= 0) {
    webpackArgs.push('--watch');
  }
  if (process.argv.indexOf('--dev') >= 0) {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
    // Watch this server
    return require('nodemon')({
      script: 'server/index.js',
      watch: ['server'],
      args: ['--no-save-config', poll ? '--watch-poll' : '--watch'],
      legacyWatch: poll,
      ext: 'js'
    })
      .on('crash', () => {
        process.exit(1);
      })
      .on('quit', process.exit);
  }
}

// Always start webpack
require('nodemon')({
  script: './node_modules/.bin/webpack',
  watch: ['webapp/config/pluginsConfig.js'],
  args: webpackArgs,
  legacyWatch: poll
})
  .on('crash', () => {
    process.exit(1);
  })
  .on('quit', process.exit);

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
const { nodeClient, walletClient } = require('./bcoinClients');

// Init bsock socket server
const socketHttpServer = http.createServer();
bsock.attach(socketHttpServer);

// Init app express server
const app = express.Router();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

// Export app and clients
module.exports = app;
app.nodeClient = nodeClient;
app.walletClient = walletClient;

// Wait for async part of server setup
app.ready = (async function() {
  // Setup bsock server
  try {
    if (nodeClient) {
      await nodeClient.open();
    }
    if (walletClient) {
      await walletClient.open();
    }
  } catch (err) {
    logger.error('Error connecting sockets: ', err);
  }

  bsock.on('socket', socketHandler(nodeClient, walletClient));

  // Setup app server
  app.use(
    express.static('dist', {
      setHeaders: function(res, path) {
        if (path.endsWith('/main.bundle.js.gz')) {
          res.setHeader('Content-Encoding', 'gzip');
          res.setHeader('Content-Type', 'application/javascript');
        }
      }
    })
  );

  const resolveIndex = (req, res) => {
    res.sendFile(path.resolve(__dirname, '../webapp/index.html'));
  };
  app.get('/', resolveIndex);

  // route to get server info
  app.get('/server', (req, res) =>
    res.status(200).send({ bcoinUri: process.env.BCOIN_URI })
  );

  // Path to route calls to bcoin node
  if (nodeClient) {
    app.use('/node', bcoinRouter(nodeClient, 'test'));
  }
  if (walletClient) {
    app.use('/node/wallet', bcoinRouter(walletClient));
  }
  app.get('/*', resolveIndex);

  // Handle the unhandled
  if (process.listenerCount('unhandledRejection') === 0) {
    process.on('unhandledRejection', function(err) {
      throw err;
    });
  }

  // Start bsock server
  socketHttpServer.listen(8000, () => {
    logger.info('Socket server connected');
  });

  // If NOT required from another script...
  if (require.main === module) {
    // Start app server
    express()
      .use(app)
      .listen(port, () => {
        logger.info('bpanel app is running on port', port);
      });
  }

  return app;
})();
