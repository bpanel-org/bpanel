'use strict';

import fs from 'fs';
import { resolve } from 'path';
import logger from './logger';

const clearPlugins = async () => {
  const indexText = 'export default {};';
  const pluginsPath = resolve(__dirname, '../webapp/plugins');
  try {
    fs.writeFileSync(resolve(pluginsPath, 'local/index.js'), indexText);
    fs.writeFileSync(resolve(pluginsPath, 'index.js'), indexText);
  } catch (e) {
    logger.error('There was an error clearing plugins: ', e);
  }
};

(async () => await clearPlugins())();
