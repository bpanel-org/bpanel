const Logger = require('blgr');

const loadConfig = require('./utils/loadConfig');

function createLogger(_config) {
  let config = _config;
  if (!config) config = loadConfig('bpanel');

  const logger = new Logger();
  logger.set({
    filename: config.bool('log-file') ? config.location('debug.log') : null,
    level: config.str('log-level', 'debug'),
    console: config.bool('log-console', true),
    shrink: config.bool('log-shrink', true)
  });
  return logger;
}

module.exports.createLogger = createLogger;
