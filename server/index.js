#!/usr/bin/env node
// bPanel server -- A Blockchain Management System
// --watch Watch webapp
// --watch-poll Watch webapp in docker on a Mac
// --dev Watch server and webapp

process.title = 'bpanel';

const path = require('path');
const os = require('os');
const { createLogger } = require('./logger');
const express = require('express');

// Import app server utilities and modules
const SocketManager = require('./socketManager');
const { attach, configHelpers } = require('./utils');
const endpoints = require('./endpoints');
const { loadConfig } = configHelpers;

// network information
const networks = {
  bitcoin: require('bcoin/lib/protocol/networks'),
  bitcoincash: require('bcash/lib/protocol/networks'),
  handshake: require('hsd/lib/protocol/networks')
};

// Setup app server
function resolveIndex(req, res) {
  req.logger.debug('Caught request in resolveIndex: %s', req.path);
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
}

// Init bPanel
module.exports = async (config = {}) => {
  // build application config
  const bpanelConfig = loadConfig('bpanel', config);

  // ensure logger
  if (!bpanelConfig.has('logger')) {
    const logger = createLogger();
    await logger.open();
    bpanelConfig.set('logger', logger);
  }

  const logger = bpanelConfig.obj('logger');

  // Init app express server
  const app = express.Router();
  app.use(express.json());

  // build whitelisted ports list for wsproxy
  // can add other custom ones via `proxy-ports` config option
  const ports = [18444, 28333, 28901].concat(
    bpanelConfig.array('proxy-ports', [])
  );

  for (let chain in networks) {
    ports.push(networks[chain].main.port);
    ports.push(networks[chain].testnet.port);
  }

  // create new SocketManager
  const socketManager = new SocketManager({
    noAuth: true,
    port: bpanelConfig.int('bsock-port', 8000),
    logger,
    ports
  });

  app.use(
    express.static(path.resolve(__dirname, '../static'), {
      index: 'index.html'
    })
  );

  app.get('/', resolveIndex);

  // add utilities to the req object
  // for use in the api endpoints
  app.use((req, res, next) => {
    req.logger = logger;
    req.config = bpanelConfig;
    req.clients = config.configsMap;
    next();
  });

  // compose endpoints
  const apiEndpoints = [];
  for (let key in endpoints) {
    apiEndpoints.push(...endpoints[key]);
  }

  for (let endpoint of apiEndpoints) {
    try {
      attach(app, endpoint);
    } catch (e) {
      logger.error(e.stack);
    }
  }

  // TODO: add favicon.ico file
  app.get('/favicon.ico', (req, res) => {
    res.send();
  });

  // This must be the last middleware so that
  // it catches and returns errors
  app.use((err, req, res, next) => {
    logger.error('There was an error in the middleware: %s', err.message);
    logger.error(err.stack);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: { status: 500, message: 'Server error' } });
  });

  socketManager.on('error', e =>
    logger.context('socket-manager').error(e.message)
  );

  // Export app, clients, & utils
  return {
    app, // express.Router
    logger, // blgr
    socketManager, // bpanel.SocketManager
    config: bpanelConfig // bcfg
  };
};
