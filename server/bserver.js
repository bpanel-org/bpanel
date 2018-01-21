/*eslint-env node*/

const path = require('path');
// const express = require('express');
const bweb = require('bweb');
const server = bweb.server({
  port: process.env.PORT || 5000,
  sockets: true
});

const logger = require('./logger');
const bcoinRouter = require('./bcoinRouter');
const socketHandler = require('./bcoinSocket').socketHandler;

server.use(server.bodyParser());
server.use(server.cookieParser());
server.use(server.jsonRPC());
server.use(server.router());
server.use(server.cors());

/**
  ROUTES
**/
server.use('/*', server.fileServer(path.join(__dirname, '../dist')));
const resolveIndex = async (req, res) => {
  res.html(path.resolve(__dirname, '../webapp/index.html'));
};
server.get('/', resolveIndex);
server.use('/node', bcoinRouter);

// route to get server info
server.get('/server', (req, res) =>
  res.status(200).send({ bcoinUri: process.env.BCOIN_URI })
);

// Path to route calls to bcoin node
server.get('/*', resolveIndex);

// Sockets
server.on('socket', socketHandler);

/**
  START SERVERS
**/
(async () => {
  await server.open();
  logger.info('Node server is running on port', server.options.port);
})();

// // start up the socket server
// bcoinSocket.listen(8000, () => {
//   logger.info('Socket server connected');
// });
