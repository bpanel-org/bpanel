'use strict';

const fs = require('bfile');
const logger = require('./logger');
const { resolve } = require('path');

module.exports = () => {
  const indexText = 'export default {};';
  const pluginsPath = resolve(__dirname, '../webapp/plugins');
  try {
    fs.writeFileSync(resolve(pluginsPath, 'local/index.js'), indexText);
    fs.writeFileSync(resolve(pluginsPath, 'index.js'), indexText);
  } catch (e) {
    logger.error('There was an error clearing plugins: ', e);
  }
};

if (require.main === module) {
  module.exports();
}
