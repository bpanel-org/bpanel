'use strict';

const fs = require('bfile');
const { createLogger } = require('./logger');
const { resolve } = require('path');

module.exports = async () => {
  const indexText =
    'export default async function() { return Promise.all([]); }';
  const pluginsPath = resolve(__dirname, '../webapp/plugins');
  try {
    fs.writeFileSync(resolve(pluginsPath, 'local/index.js'), indexText);
    fs.writeFileSync(resolve(pluginsPath, 'index.js'), indexText);
  } catch (e) {
    const logger = createLogger();
    await logger.open();
    logger.error('There was an error clearing plugins: ', e);
    await logger.close();
  }
};

if (require.main === module) {
  module.exports();
}
