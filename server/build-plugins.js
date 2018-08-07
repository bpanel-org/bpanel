'use strict';

const fs = require('fs');
const os = require('os');
const assert = require('assert');
const { resolve } = require('path');
const { format } = require('prettier');
const { execSync } = require('child_process');

const logger = require('./logger');

const pluginsConfig = resolve(os.homedir(), '.bpanel/config.js');

const camelize = str =>
  str
    // 1st deal w/ scoped packages (e.g. remove `@bpanel/`)
    .replace(/^\W+[\w]+[\W]/, '')
    .replace(/_/g, '-')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/[^\w]/gi, '');

const getPackageName = name => {
  if (name.indexOf('/') !== -1 && name[0] !== '@') {
    // this is a GitHub repo
    return name.split('/')[1];
  } else {
    return name;
  }
};

const prepareModules = async (plugins = [], local = true) => {
  const pluginsPath = resolve(__dirname, '../webapp/plugins');
  let pluginsIndex = local
    ? '// exports for all local plugin modules\n\n'
    : '// exports for all published plugin modules\n\n';
  let importsText = '';
  let exportsText = 'export default {';
  let installPackages = [];

  plugins.forEach(name => {
    const packageName = getPackageName(name);
    const camelized = camelize(packageName);
    const modulePath = local ? `./${packageName}` : packageName;
    if (!local) installPackages.push(name);
    importsText += `import * as ${camelized} from '${modulePath}';\n`;
    exportsText += `${camelized},`;
  });

  if (installPackages.length) {
    try {
      if (resolve(process.cwd(), 'server') != __dirname) {
        // HACK: When required, we need to install the plugin peer-dependencies
        logger.info('Installing base packages...');
        execSync('npm install --production', {
          stdio: [0, 1, 2],
          cwd: resolve(__dirname, '..')
        });
      }
      if (!local) {
        // check if connected to internet
        // if not, skip npm install
        const EXTERNAL_URI = process.env.EXTERNAL_URI || 'npmjs.com';
        await require('dns').lookup(EXTERNAL_URI, async err => {
          if (err && err.code === 'ENOTFOUND')
            logger.error("Can't reach npm servers. Skipping npm install");
          else {
            logger.info('Installing plugin packages...');
            await execSync(
              `npm install --no-save ${installPackages.join(' ')} --production`,
              {
                stdio: [0, 1, 2],
                cwd: resolve(__dirname, '..')
              }
            );
            logger.info('Done installing plugins');
          }
        });
      }
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
  try {
    assert(
      fs.existsSync(pluginsConfig),
      'bPanel config file not found. Please run `npm install` before \
starting the server and building the app to automatically generate \
your config file.'
    );

    const { localPlugins, plugins } = require(pluginsConfig);
    prepareModules(localPlugins);
    await prepareModules(plugins, false);
  } catch (err) {
    logger.error('There was an error preparing modules: ', err.stack);
  }
})();
