#!/usr/bin/env node
// bPanel server -- A Blockchain Management System
// --watch Watch webapp
// --watch-poll Watch webapp in docker on a Mac
// --dev Watch server and webapp

process.title = 'bpanel';

const path = require('path');
const os = require('os');
const { createLogger } = require('./logger');
const chokidar = require('chokidar');
const express = require('express');

// network information
const networks = {
  bitcoin: require('bcoin/lib/protocol/networks'),
  bitcoincash: require('bcash/lib/protocol/networks'),
  handshake: require('hsd/lib/protocol/networks')
};

// Import express middlewares
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');

// Import app server utilities and modules
const SocketManager = require('./socketManager');
const { attach, apiFilters, pluginUtils, configHelpers } = require('./utils');
const endpoints = require('./endpoints');

const { isBlacklisted } = apiFilters;
const { getPluginEndpoints } = pluginUtils;
const { loadConfig } = configHelpers;

// Setup app server
function resolveIndex(req, res) {
  req.logger.debug('Caught request in resolveIndex: %s', req.path);
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
}

// black list filter
function forbiddenHandler(req, res) {
  return res.json(403, {
    error: { message: 'Forbidden', code: 403 }
  });
}

let configsMap = new Map();

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
  app.use(bodyParser.json());
  app.use(cors());
  app.use(compression());

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

  app.use((req, res, next) => {
    try {
      if (isBlacklisted(bpanelConfig, req)) return forbiddenHandler(req, res);
      next();
    } catch (e) {
      next(e);
    }
  });

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

  app.get('/', resolveIndex);

  // add utilities to the req object
  // for use in the api endpoints
  // TODO: Load up client configs and attach to req object here
  app.use((req, res, next) => {
    req.logger = logger;
    req.config = bpanelConfig;
    req.clients = configsMap;
    next();
  });

  /*
   * Setup backend plugins
   */

  const { beforeMiddleware, afterMiddleware } = getPluginEndpoints(
    bpanelConfig,
    logger
  );

  // compose endpoints
  const apiEndpoints = [...beforeMiddleware];
  for (let key in endpoints) {
    apiEndpoints.push(...endpoints[key]);
  }
  apiEndpoints.push(...afterMiddleware);

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

  app.get('/*', resolveIndex);

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

  // watch the config file
  // subroutine to watch config file directory and maintain
  // map of config files
  // every time a config file is updated, rebuild map of config files
  // map of config files is global variable that is attached to every
  // request via express middleware
  // TODO: wrap in if statement to allow turning off
  const configFile = path.resolve(os.homedir(), '.bpanel/config.js');
  chokidar
    .watch([configFile], {
      usePolling: bpanelConfig.bool('dynamicclients'),
      useFsEvents: bpanelConfig.bool('dynamicclients')
    })
    .on('all', () => {
      logger.context('chokidar').debug('config file change');
    });

  // Export app, clients, & utils
  return {
    app, // express.Router
    logger, // blgr
    socketManager, // bpanel.SocketManager
    config: bpanelConfig // bcfg
  };
};
