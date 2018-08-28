'use strict';

const fs = require('fs');

const assert = require('assert');
const { resolve } = require('path');
const Config = require('bcfg');
const { format } = require('prettier');
const { execSync } = require('child_process');

const logger = require('./logger');

const config = new Config('bpanel');
config.load({ env: true, argv: true, arg: true });
const pluginsConfig = resolve(config.prefix, 'config.js');
const modulesDirectory = resolve(__dirname, '../node_modules');
const homePrefix = process.env.BPANEL_PREFIX;

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

async function installRemotePackages(installPackages) {
  // check if connected to internet
  // if not, skip npm install
  const EXTERNAL_URI = process.env.EXTERNAL_URI || 'npmjs.com';
  await require('dns').lookup(EXTERNAL_URI, async err => {
    if (err && err.code === 'ENOTFOUND')
      logger.error(`Can't reach npm servers. Skipping npm install`);
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

function symlinkLocal(packageName) {
  let name = packageName;
  // set temporary name for symlink since fs can't overwrite
  // with symlink method
  if (fs.existsSync(resolve(modulesDirectory, packageName)))
    name = `_${packageName}`;

  fs.symlinkSync(
    resolve(homePrefix, 'local_plugins', packageName),
    resolve(modulesDirectory, name)
  );

  // now rename in order to overwrite
  if (name !== packageName)
    fs.rename(
      resolve(modulesDirectory, name),
      resolve(modulesDirectory, packageName)
    );
}

const prepareModules = async (plugins = [], local = true) => {
  const pluginsPath = resolve(__dirname, '../webapp/plugins');
  let pluginsIndex = local
    ? '// exports for all local plugin modules\n\n'
    : '// exports for all published plugin modules\n\n';
  let importsText = '';
  let exportsText = 'export default {';
  let installPackages = [];

  // Create the index.js files for exposing the plugins
  plugins.forEach(name => {
    const packageName = getPackageName(name);
    try {
      const camelized = camelize(packageName);
      let modulePath;
      if (fs.existsSync(resolve(pluginsPath, 'local', packageName)) && local)
        // maintain support for plugins in plugins/local dir
        modulePath = `./${packageName}`;
      // set import to alias for bpanel's local_plugins dir set in webpack
      else modulePath = local ? `&local/${packageName}` : packageName;

      // add plugin to list of packages that need to be installed w/ npm
      if (!local) installPackages.push(name);

      importsText += `import * as ${camelized} from '${modulePath}';\n`;

      exportsText += `${camelized},`;
    } catch (e) {
      logger.error(`There was an error preparing ${packageName}: ${e}`);
    }
  });

  // Installation step
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
        // check if modules need to be installed by confirming
        // if any plugins don't exist yet in our node_modules
        const newModules = installPackages.some(
          pkg => !fs.existsSync(resolve(modulesDirectory, pkg))
        );

        if (newModules) await installRemotePackages(installPackages);
        else
          logger.info('No new remote plugins to install. Skipping npm install');
      } else {
        // create a symlink for local modules to node_modules
        // so that webpack can watch for changes
        symlinkLocal(name);
      }
    } catch (e) {
      logger.error('Error installing plugins packages: ', e);
    }
  }

  exportsText += '}';
  pluginsIndex += `${importsText}\n\n`;
  pluginsIndex += exportsText;

  pluginsIndex = format(pluginsIndex, { singleQuote: true, parser: 'babylon' });
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
