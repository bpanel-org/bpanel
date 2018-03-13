#!/usr/bin/env node
// Bpanel server -- The bcoin UI
// --watch Watch webapp
// --dev Watch server and webapp
// --no-save-config Don't turn ENV into config

// If run from command line, parse args
if (require.main === module) {
  if (process.argv.indexOf('--no-save-config') < 0) {
    // Turn env into config and save
    require('./saveConfig.js');
  }
  if (process.argv.indexOf('--dev') >= 0) {
    // Watch server instead
    return require('nodemon')({
      script: 'server/index.js',
      watch: ['server'],
      args: ['--no-save-config', '--watch'],
      ext: 'js',
    }).on('crash', () => {
      process.exit(1);
    }).on('quit', process.exit);
  }
}

// Always start webpack
require('nodemon')({
  script: './node_modules/.bin/webpack',
  args: (process.argv.indexOf('--watch') >= 0)? ['--watch']: [],
  watch: ['webapp/config/pluginsConfig.js'],
}).on('crash', () => {
  process.exit(1);
}).on('quit', process.exit);

// make server
const path = require('path');
const http = require('http');
const express = require('express');
const bsock = require('bsock').createServer();

// import express middlewares
const bodyParser = require('body-parser');
const cors = require('cors');

// import app server utilities and modules
const logger = require('./logger');
const bcoinRouter = require('./bcoinRouter');
const socketHandler = require('./bcoinSocket');
const { nodeClient, walletClient } = require('./bcoinClients');

// Preparing bsock socket server and express server
const app = express();
module.exports = app; //TODO: dont listen, return router & clients

const socketHttpServer = http.createServer();
bsock.attach(socketHttpServer);
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(cors());

(async function() {
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

  /**
    ROUTES
  **/
  app.use(express.static(path.join(__dirname, '../dist')));
  const resolveIndex = (req, res) => {
    res.sendFile(path.resolve(__dirname, '../webapp/index.html'));
  };
  app.get('/', resolveIndex);

  // route to get server info
  app.get('/server', (req, res) =>
    res.status(200).send({ bcoinUri: process.env.BCOIN_URI })
  );

  // Path to route calls to bcoin node
  if (walletClient) {
    app.use('/node/wallet', bcoinRouter(walletClient));
  }
  if (nodeClient) {
    app.use('/node', bcoinRouter(nodeClient));
  }
  app.get('/*', resolveIndex);

  /**
    START SERVERS
  **/
  app.listen(app.get('port'), () => {
    logger.info('Node app is running on port', app.get('port'));
  });

  // start up the socket server
  socketHttpServer.listen(8000, () => {
    logger.info('Socket server connected');
  });
})();
