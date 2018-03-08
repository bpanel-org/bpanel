'use strict';

import fs from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';

import localPlugins from '../webapp/config/localPlugins';

const camelize = str =>
  str
    .replace(/_/g, '-')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/[^\w\s]/gi, '');

const pluginsPath = resolve(__dirname, '../webapp/plugins');
let pluginsIndex = '// exports for all local plugin modules\n\n';
let importsText = '';
let exportsText = 'export default {';

localPlugins.forEach(name => {
  const camelized = camelize(name);
  importsText += `import * as ${camelized} from './${name}';\n`;
  exportsText += `${camelized},`;
});

exportsText += '}';
pluginsIndex += `${importsText}\n\n`;
pluginsIndex += exportsText;

pluginsIndex = format(pluginsIndex, { singleQuote: true });

fs.writeFileSync(resolve(pluginsPath, 'local/index.js'), pluginsIndex);
