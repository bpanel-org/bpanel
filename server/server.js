/*eslint-env node*/
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
const { nodeClient } = require('./bcoinClients');

// Preparing bsock socket server and express server
const app = express();
const socketServer = http.createServer();
bsock.attach(socketServer);
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(cors());

(async function() {
  await nodeClient.open();
  nodeClient.fire('auth');

  const nodeRouter = bcoinRouter(nodeClient);
  bsock.on('socket', socketHandler(nodeClient));

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
  app.use('/node', nodeRouter);
  app.get('/*', resolveIndex);

  /**
    START SERVERS
  **/
  app.listen(app.get('port'), () => {
    logger.info('Node app is running on port', app.get('port'));
  });

  // start up the socket server
  socketServer.listen(8000, () => {
    logger.info('Socket server connected');
  });
})();
