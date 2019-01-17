#!/usr/bin/env node
// bPanel server -- A Blockchain Management System
// --watch Watch webapp
// --watch-poll Watch webapp in docker on a Mac
// --dev Watch server and webapp

process.title = 'bpanel';

const path = require('path');
const fs = require('bfile');
const { execSync } = require('child_process');
const os = require('os');
const { createLogger } = require('./logger');
const chokidar = require('chokidar');
const http = require('http');
const https = require('https');
const express = require('express');

const { parseArgs } = require('./utils/parseArgs');

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
const {
  attach,
  apiFilters,
  pluginUtils,
  clientHelpers,
  configHelpers
} = require('./utils');
const endpoints = require('./endpoints');

const { isBlacklisted } = apiFilters;
const { getPluginEndpoints } = pluginUtils;
const { buildClients, getClientsById } = clientHelpers;
const { loadConfig } = configHelpers;

// Crash the process when a service does
function onError(service, logger) {
  return e => {
    logger.error('%s error: %s', service, e.message);
    process.exit(1);
  };
}

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

// global clients and configsMap
let clients = {};
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

// Start server when run from command line
if (require.main === module) {
  (async function() {
    const logger = createLogger();
    await logger.open();

    let socketManager;

    try {
      const args = parseArgs({ module: false });

      const config = args.config;
      config.set('logger', logger);

      // do side effects

      // clear plugins
      if (args.clear) {
        clear();
        process.exit();
      }

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

      if (args.startWebpack) {
        require('nodemon')({
          script: './node_modules/.bin/webpack',
          watch: [`${config.prefix}/config.js`],
          env: {
            BPANEL_PREFIX: args.config.prefix,
            BPANEL_SOCKET_PORT: args.config.int('bsockport', 8000),
            BPANEL_LOG_LEVEL: args.config.str('loglevel', 'info'),
            BPANEL_LOG_FILE: args.config.bool('logfile', true),
            BPANEL_LOG_CONSOLE: args.config.bool('logconsole', true),
            BPANEL_LOG_SHRINK: args.config.bool('logshrink', true)
          },
          args: args.webpack,
          legacyWatch: args.watch
        })
          .on('restart', file => {
            logger
              .context('nodemon - webpack')
              .debug('restarting server: %s', file);
          })
          .on('crash', () => {
            logger.context('nodemon - webpack').debug('crash');
            process.exit(1);
          })
          .on('quit', () => {
            logger.context('nodemon - webpack').debug('quitting');
            process.exit();
          });
      }

      if (args.dev) {
        // watch the server files
        const nodemon = require('nodemon')({
          script: 'server/index.js',
          watch: ['server/**/*.js'],
          ignore: ['server/test/**/*.js'],
          args: args.server,
          legacyWatch: args.watch,
          ext: 'js'
        })
          .on('restart', file => {
            // do something to make sure server is stopped
            logger
              .context('nodemon - server')
              .debug('restarting server: %s', file);
            logger.info('%s', file);
          })
          .on('crash', () => {
            logger.context('nodemon - server').debug('crash');
            process.exit(1);
          })
          .on('quit', () => {
            logger.context('nodemon - server').debug('quitting');
            process.exit();
          });

        // check if vendor-manifest has been built otherwise run
        // build:dll first to build the manifest
        if (
          !fs.existsSync(
            path.resolve(__dirname, '../dist/vendor-manifest.json')
          )
        ) {
          logger.info(
            'No vendor manifest. Running webpack dll first. This can take a couple minutes the first time but \
      will increase speed of future builds, so please be patient.'
          );
          execSync('npm run build:dll', {
            stdio: [0, 1, 2],
            cwd: path.resolve(__dirname, '..')
          });
        }
      } else {
        // not development mode

        // non development mode
        const bpanel = await module.exports(config);

        socketManager = bpanel.socketManager;

        let protocol;
        let opts = {};

        if (config.bool('ssl', false)) {
          protocol = https;
          logger.info('starting server using https');

          const keyPath = config.str('ssl-key', '/etc/ssl/key.pem');
          const certPath = config.str('ssl-cert', '/etc/ssl/cert.pem');

          try {
            opts.key = fs.readFileSync(keyPath);
            opts.cert = fs.readFileSync(certPath);
          } catch (e) {
            logger.error(e);
            logger.error('Error reading cert/key pair');
            process.exit(1);
          }
        } else {
          protocol = http;
          logger.info('starting server using http');
        }

        const port = config.int('port', 5000);

        const app = bpanel.app;
        //await socketManager.open();

        // start the server
        // requires nodejs 10+
        // protocol is either nodejs.http or nodejs.https
        const server = protocol
          .createServer(opts, express().use(app))
          .on('error', onError('bpanel', logger))
          .listen(port, () => {
            logger.info('bpanel app running on port %s', port);
          });
      }

      // create watch for clients
      if (args.dynamicClients) {
        const clientsDir = args.config.location('clients');
        chokidar
          .watch([clientsDir], {
            usePolling: args.watch,
            useFsEvents: args.watch
          })
          .on('add', path => {
            logger.info(
              'Change detected in clients directory. Updating clients on server.'
            );
            logger.debug('added %s', path);
            const builtClients = buildClients(config);

            // global variables
            clients = builtClients.clients;
            configsMap = builtClients.configsMap;

            // emit to socket manager update
            for (const [id, client] of clients) {
              const clientsById = getClientsById(id, clients);
              if (socketManager)
                socketManager.emit('add client', id, clientsById);
            }
          });
      }
    } catch (e) {
      logger.error('There was an error running the server: ', e.stack);
      await logger.close();
      process.exit(1);
    }
  })();
}
