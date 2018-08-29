const winston = require('winston');
const fs = require('bfile');

/** Configure the logger */
const logDir = __dirname.concat('/../logs');
const env = process.env.NODE_ENV || 'development';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: env === 'development' ? 'debug' : 'info',
      filename: logDir.concat('/logs.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

/*
  Stream is used to allow morgan to style console output
  in server.js
*/
module.exports = logger;
module.exports.stream = {
  write: message => logger.info(message)
};
