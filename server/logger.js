const Logger = require('blgr');

const loadConfig = require('./utils/loadConfig');

const config = loadConfig('bpanel');

const logger = new Logger();
logger.set({
  filename: config.bool('log-file') ? config.location('debug.log') : null,
  level: config.str('log-level', 'debug'),
  console: config.bool('log-console', true),
  shrink: config.bool('log-shrink', true)
});

logger.open();

module.exports = logger;
