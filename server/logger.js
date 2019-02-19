const Logger = require('blgr');
const Config = require('bcfg');
const assert = require('bsert');

const loadConfig = require('./utils/loadConfig');

function createLogger(_config) {
  let config = _config;
  if (!config) config = loadConfig('bpanel');
  assert(config instanceof Config, 'Must pass Bcfg object to create logger');

  const logger = new Logger();
  logger.set({
    filename: config.bool('log-file', true)
      ? config.location('debug.log')
      : null,
    level: config.str('log-level', 'info'),
    console: config.bool('log-console', true),
    shrink: config.bool('log-shrink', true)
  });
  return logger;
}

module.exports.createLogger = createLogger;
