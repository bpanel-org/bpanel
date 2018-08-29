'use strict';

const fs = require('bfile');
const os = require('os');
const assert = require('bsert');
const { resolve } = require('path');
const Config = require('bcfg');
const { format } = require('prettier');
const { execSync } = require('child_process');
const validate = require('validate-npm-package-name');

const logger = require('./logger');

const config = new Config('bpanel');
config.load({ env: true, argv: true, arg: true });
const pluginsConfig = resolve(config.prefix, 'config.js');
const modulesDirectory = resolve(__dirname, '../node_modules');

// location of app configs and local plugins
// defaults to ~/.bpanel/
// this is set using bcfg at runtime with server
// and passed through via webpack to this script
const homePrefix =
  process.env.BPANEL_PREFIX || resolve(os.homedir(), '.bpanel');

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
      // validation is done earlier, but still confirming at this step
      const pkgStr = installPackages.reduce((str, name) => {
        if (validate(name).validForNewPackages)
          // add spacing for all but first pkg name
          str = `${str} ${name}`;
        return str;
      }, '');
      logger.info(`Installing plugin packages: ${pkgStr.split(' ')}`);
      execSync(`npm install --no-save ${pkgStr} --production`, {
        stdio: [0, 1, 2],
        cwd: resolve(__dirname, '..')
      });
      logger.info('Done installing remote plugins');
    }
  });
}

/*
 * Adds a symlink for a specific package from the local_plugins
 * directory in BPANEL_PREFIX to the local app's node_modules.
 * This allows webpack to watch for changes.
 */
async function symlinkLocal(packageName) {
  logger.info(`Creating symlink for local plugin ${packageName}...`);
  const pkgDir = resolve(modulesDirectory, packageName);

  // remove existing version of plugin
  const exists = fs.existsSync(pkgDir);
  if (exists) {
    logger.info(
      `While preparing symlink for ${packageName}, found existing copy. Overwriting with linked local verison`
    );
    const stat = await fs.lstat(pkgDir);

    // if it exists but is a symlink
    // remove symlink so we can replace with our new one
    if (stat.isSymbolicLink()) await fs.unlink(pkgDir);
    // otherwise remove the old directory
    else await fs.rimraf(pkgDir);
  }

  await fs.symlink(
    resolve(homePrefix, 'local_plugins', packageName),
    resolve(modulesDirectory, pkgDir)
  );
}

// a utility method to check if a module exists in node_modules
// useful for confirming if a plugin has already been installed
async function checkForModuleExistence(pkg) {
  const pkgPath = resolve(modulesDirectory, pkg);
  const exists = fs.existsSync(pkgPath);

  // if it doesn't exist we have our answer
  if (!exists) return false;

  // otherwise need to confirm that it's not a symbolic link
  const stat = await fs.lstat(pkgPath);

  // if package exists and is not a symbolic link return false
  return exists && !stat.isSymbolicLink();
}

async function prepareModules(plugins = [], local = true) {
  const pluginsPath = resolve(__dirname, '../webapp/plugins');
  let pluginsIndex = local
    ? '// exports for all local plugin modules\n\n'
    : '// exports for all published plugin modules\n\n';
  let importsText = '';
  let exportsText = 'export default {';
  let installPackages = [];

  // Create the index.js files for exposing the plugins
  for (let i = 0; i < plugins.length; i++) {
    const name = plugins[i];
    const packageName = getPackageName(name);
    try {
      const validator = validate(packageName);

      // make sure that we are working with valid package names
      // this is important to avoid injecting arbitrary scripts in
      // later execSync steps.
      assert(
        validator.validForNewPackages,
        `${packageName} is not a valid package name and will not be installed: ${validator.errors &&
          validator.errors.join(', ')}`
      );
      const camelized = camelize(packageName);
      let modulePath;

      // check if the plugin exists in webapp/plugins/local
      // and import from there if it does
      const exists = fs.existsSync(resolve(pluginsPath, 'local', packageName));
      if (exists && local)
        // maintain support for plugins in plugins/local dir
        modulePath = `./${packageName}`;
      // set import to webpack's alias for bpanel's local_plugins dir
      else modulePath = local ? `&local/${packageName}` : packageName;

      // add plugin to list of packages that need to be installed w/ npm
      if (!local) installPackages.push(name);
      else {
        // create a symlink for local modules to node_modules
        // so that webpack can watch for changes
        await symlinkLocal(name);
      }

      importsText += `import * as ${camelized} from '${modulePath}';\n`;
      exportsText += `${camelized},`;
    } catch (e) {
      logger.error(`There was an error preparing ${packageName}`);
      logger.error(e.stack);
    }
  }

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
        let newModules = false;
        for (let i = 0; i < installPackages.length; i++) {
          const pkg = installPackages[i];
          newModules = !(await checkForModuleExistence(pkg));
          if (newModules) break;
        }

        // if there are new modules, install them with npm
        if (newModules) await installRemotePackages(installPackages);
        else
          logger.info('No new remote plugins to install. Skipping npm install');
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
  await fs.writeFile(resolve(pluginsPath, pluginsIndexPath), pluginsIndex);
  return true;
}

(async () => {
  try {
    assert(
      fs.existsSync(pluginsConfig),
      'bPanel config file not found. Please run `npm install` before \
starting the server and building the app to automatically generate \
your config file.'
    );

    const { localPlugins, plugins } = require(pluginsConfig);
    await prepareModules(plugins, false);
    await prepareModules(localPlugins);
  } catch (err) {
    logger.error('There was an error preparing modules: ', err.stack);
  }
})();
