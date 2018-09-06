const fs = require('fs');
const os = require('os');
const path = require('path');
const logger = require('../server/logger');

const BPANEL_DIR = path.resolve(os.homedir(), '.bpanel');
const CONFIGS_FILE = path.resolve(BPANEL_DIR, './config.js');
const CLIENTS_DIR = path.resolve(BPANEL_DIR, 'clients');
const LOCAL_PLUGINS_DIR = path.resolve(BPANEL_DIR, 'local_plugins');

const configText = `module.exports = {
  plugins: ['@bpanel/genesis-theme', '@bpanel/bui'],
  localPlugins: [],
}`;

try {
  if (!fs.existsSync(BPANEL_DIR)) {
    logger.info(`No module directory found. Creating one at ${BPANEL_DIR}`);
    fs.mkdirSync(BPANEL_DIR);
  }

  if (!fs.existsSync(CONFIGS_FILE)) {
    logger.info(
      `No configuration file found. Initializing one at ${CONFIGS_FILE}`
    );
    fs.appendFileSync(CONFIGS_FILE, configText);
  }

  if (!fs.existsSync(LOCAL_PLUGINS_DIR)) {
    logger.info(
      `No local plugins directory file found. Creating one at ${LOCAL_PLUGINS_DIR}`
    );
    fs.mkdirSync(LOCAL_PLUGINS_DIR);
  }

  if (!fs.existsSync(CLIENTS_DIR)) {
    logger.info(
      `No clients directory file found. Creating one at ${CLIENTS_DIR}`
    );
    fs.mkdirSync(CLIENTS_DIR);
  }

  require('./version.js');
} catch (e) {
  logger.error('There was a problem initializing the project: ', e.stack);
  process.exit(1);
}
