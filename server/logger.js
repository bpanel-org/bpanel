const blgr = require('blgr');
const fs = require('bfile');

/** Configure the logger */
const logDir = __dirname.concat('/../logs');
const env = process.env.NODE_ENV || 'development';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = new blgr();
logger.set({
  level: env === 'development' ? 'debug' : 'info',
  colors: true,
  filename: logDir.concat('/logs.log')
});

logger.open();

module.exports = logger;
module.exports.stream = {
  write: message => logger.info(message)
};
