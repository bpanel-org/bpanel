'use strict';

import fs from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { format } from 'prettier';
import logger from './logger';

import { localPlugins, plugins } from '../webapp/config/pluginsConfig';

const camelize = str =>
  str
    // 1st deal w/ scoped packages (e.g. remove `@bpanel/`)
    .replace(/^\W+[\w]+[\W]/, '')
    .replace(/_/g, '-')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/[^\w]/gi, '');

const prepareModules = (plugins = [], local = true) => {
  const pluginsPath = resolve(__dirname, '../webapp/plugins');
  let pluginsIndex = local
    ? '// exports for all local plugin modules\n\n'
    : '// exports for all published plugin modules\n\n';
  let importsText = '';
  let exportsText = 'export default {';
  let installPackages = [];

  plugins.forEach(name => {
    const camelized = camelize(name);
    const modulePath = local ? `./${name}` : name;
    if (!local) installPackages.push(name);
    importsText += `import * as ${camelized} from '${modulePath}';\n`;
    exportsText += `${camelized},`;
  });

  if (installPackages.length) {
    try {
      logger.info('Installing plugin packages...');
      execSync(
        `npm install --no-save ${installPackages.join(' ')} --production`,
        {
          stdio: [0, 1, 2]
        }
      );
      // execSync(`npm install`, { stdio: [0, 1, 2] });
      logger.info('Done installing plugins');
    } catch (e) {
      logger.error('Error installing plugins packages: ', e);
    }
  }

  exportsText += '}';
  pluginsIndex += `${importsText}\n\n`;
  pluginsIndex += exportsText;

  pluginsIndex = format(pluginsIndex, { singleQuote: true });
  const pluginsIndexPath = local ? 'local/index.js' : 'index.js';
  fs.writeFileSync(resolve(pluginsPath, pluginsIndexPath), pluginsIndex);
};

(async () => {
  prepareModules(localPlugins);
  await prepareModules(plugins, false);
})();
