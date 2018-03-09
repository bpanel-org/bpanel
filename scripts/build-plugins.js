'use strict';

import fs from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';

import { localPlugins, plugins } from '../webapp/config/pluginsConfig';

const camelize = str =>
  str
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

  plugins.forEach(name => {
    const camelized = camelize(name);
    const modulePath = local ? `./${name}` : name;
    importsText += `import * as ${camelized} from '${modulePath}';\n`;
    exportsText += `${camelized},`;
  });

  exportsText += '}';
  pluginsIndex += `${importsText}\n\n`;
  pluginsIndex += exportsText;

  pluginsIndex = format(pluginsIndex, { singleQuote: true });
  const pluginsIndexPath = local ? 'local/index.js' : 'index.js';
  fs.writeFileSync(resolve(pluginsPath, pluginsIndexPath), pluginsIndex);
};

prepareModules(localPlugins);
prepareModules(plugins, false);
