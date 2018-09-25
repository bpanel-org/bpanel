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
const npmExists = require('./npm-exists');

const config = new Config('bpanel');
config.load({ env: true, argv: true, arg: true });
const PLUGINS_CONFIG = resolve(config.prefix, 'config.js');
const MODULES_DIRECTORY = resolve(__dirname, '../node_modules');
const PLUGINS_PATH = resolve(__dirname, '../webapp/plugins');

// location of app configs and local plugins
// defaults to ~/.bpanel/
// this is set using bcfg at runtime with server
// and passed through via webpack to this script
const HOME_PREFIX =
  process.env.BPANEL_PREFIX || resolve(os.homedir(), '.bpanel');

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
        if (validate(name).validForNewPackages) str = `${str} ${name}`;
        return str;
      });
      logger.info(`Installing plugin packages: ${pkgStr.split(' ')}`);

      try {
        await execSync(`npm install --no-save ${pkgStr} --production`, {
          stdio: [0, 1, 2],
          cwd: resolve(__dirname, '..')
        });
        logger.info('Done installing remote plugins');
      } catch (e) {
        logger.error(
          'There was an error installing plugins. Sometimes this is because of permissions errors \
in node_modules. Try deleting the node_modules directory and running `npm install` again.'
        );
        logger.error(e.stack);
        process.exit(1);
      }
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
  const pkgDir = resolve(MODULES_DIRECTORY, packageName);

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

  // for scoped packages, the scope becomes a parent directory
  // if the parent directory doesn't exist, we need to create it
  if (packageName.startsWith('@')) {
    // if scoped, get directory name
    const pathIndex = packageName.indexOf('/');
    assert(
      pathIndex > -1,
      'Scoped package name should have child path with "/" separator'
    );
    const scopeName = packageName.substring(0, pathIndex);
    const scopePath = resolve(MODULES_DIRECTORY, scopeName);
    const scopeExists = await fs.existsSync(scopePath);

    // make directory if it did not exist
    if (!scopeExists) await fs.mkdir(scopePath);
  }

  // if the origin does not exist, log an error
  const originPath = resolve(HOME_PREFIX, 'local_plugins', packageName);
  if (!fs.existsSync(originPath))
    logger.error(`Origin package did not exist at ${originPath}, skipping...`);
  else
    await fs.symlink(
      resolve(HOME_PREFIX, 'local_plugins', packageName),
      resolve(MODULES_DIRECTORY, pkgDir)
    );
}

// a utility method to check if a module exists in node_modules
// useful for confirming if a plugin has already been installed
async function checkForModuleExistence(pkg) {
  const pkgPath = resolve(MODULES_DIRECTORY, pkg);
  const exists = fs.existsSync(pkgPath);

  // if it doesn't exist we have our answer
  if (!exists) return false;

  // otherwise need to confirm that it's not a symbolic link
  const stat = await fs.lstat(pkgPath);

  // if package exists and is not a symbolic link return false
  return exists && !stat.isSymbolicLink();
}

// get names of plugins that are available local to the project
async function getLocalPlugins() {
  const localPath = resolve(PLUGINS_PATH, 'local');
  const contents = fs.readdirSync(localPath);
  const plugins = [];
  for (let i = 0; i < contents.length; i++) {
    const name = contents[i];
    const stats = fs.lstatSync(resolve(localPath, name));

    // only add directories and non system/hidden directories
    if (stats.isDirectory() && name[0] !== '.') plugins.push(name);
  }
  return plugins;
}

async function prepareModules(plugins = [], local = true) {
  let pluginsIndex = local
    ? '// exports for all local plugin modules\n\n'
    : '// exports for all published plugin modules\n\n';

  let exportsText = 'export default async function() { \n return Promise.all([';
  let installPackages = [];

  // get any plugins local to the project if building local plugins
  if (local) {
    const localPlugins = await getLocalPlugins();
    plugins.push(...localPlugins);
  }

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

      let modulePath;

      // check if the plugin exists in webapp/plugins/local
      // and import from there if it does
      const existsLocal = fs.existsSync(
        resolve(PLUGINS_PATH, 'local', packageName)
      );

      // if adding a remote plugin and it doesn't exist on npm, skip
      const existsRemote = await npmExists(packageName);
      if (!local && !existsRemote) {
        logger.error(
          `Remote module ${packageName} does not exist on npm. If developing locally, add to local plugins. Skipping...`
        );
        continue;
      }

      if (existsLocal && local)
        // maintain support for plugins in plugins/local dir
        modulePath = `./${packageName}`;
      // set import to webpack's alias for bpanel's local_plugins dir
      else modulePath = local ? `&local/${packageName}` : packageName;

      // add plugin to list of packages that need to be installed w/ npm
      if (!local && existsRemote) installPackages.push(name);
      else if (local && !existsLocal) {
        // create a symlink for local modules in [PREFIX]/local_plugins to node_modules
        // so that webpack can watch for changes
        await symlinkLocal(name);
      }

      // only add imports for packages that have been installed
      if (existsLocal || fs.existsSync(resolve(MODULES_DIRECTORY, packageName)))
        exportsText += `import('${modulePath}'),`;
      else if (!local && existsRemote)
        exportsText += `import('${modulePath}'),`;
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

  exportsText += ']); \n }';
  pluginsIndex += exportsText;
  pluginsIndex = format(pluginsIndex, { singleQuote: true, parser: 'babylon' });

  const pluginsIndexPath = local ? 'local/index.js' : 'index.js';
  await fs.writeFile(resolve(PLUGINS_PATH, pluginsIndexPath), pluginsIndex);
  return true;
}

(async () => {
  try {
    assert(
      fs.existsSync(PLUGINS_CONFIG),
      'bPanel config file not found. Please run `npm install` before \
starting the server and building the app to automatically generate \
your config file.'
    );

    const { localPlugins, plugins } = require(PLUGINS_CONFIG);
    // CLI & ENV plugins override configuration file
    const envPlugins = config.str('plugins');
    await prepareModules(
      envPlugins ? envPlugins.split(',').map(s => s.trim(s)) : plugins,
      false
    );
    await prepareModules(localPlugins);
  } catch (err) {
    logger.error('There was an error preparing modules: ', err.stack);
  }
})();
