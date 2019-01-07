/* eslint-disable no-console */

// no non-native modules should be imported here
// since this file gets run BEFORE `npm install`
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const semver = require('../vendor/semver');

const BPANEL_DIR = path.resolve(os.homedir(), '.bpanel');
const CONFIGS_FILE = path.resolve(BPANEL_DIR, './config.js');
const SECRETS_FILE = path.resolve(BPANEL_DIR, './secrets.json');
const CLIENTS_DIR = path.resolve(BPANEL_DIR, 'clients');
const LOCAL_PLUGINS_DIR = path.resolve(BPANEL_DIR, 'local_plugins');

const configText = `module.exports = {
  plugins: ['@bpanel/genesis-theme', '@bpanel/settings', '@bpanel/connection-manager'],
  localPlugins: [],
}`;

// simple utility to remove whitespace from string
function trim(string) {
  return string.replace(/^\s+|\s+$/g, '');
}

try {
  // check minimum version of npm
  let npmVersion = execSync('npm --version', {
    encoding: 'utf8'
  });
  let nodeVersion = process.version;

  npmVersion = trim(npmVersion);

  const npmMin = process.env.npm_package_engines_npm;
  const nodeMin = process.env.npm_package_engines_node;

  if (
    !semver.satisfies(npmVersion, npmMin) ||
    !semver.satisfies(nodeVersion, nodeMin)
  )
    throw new Error(
      `bPanel requires npm version ${npmMin} and node version ${nodeMin}. \
You are running npm ${npmVersion} and node ${nodeVersion}. Please check your $PATH variable, \
update and try again.`
    );

  if (!fs.existsSync(BPANEL_DIR)) {
    console.log(
      `info: No module directory found. Creating one at ${BPANEL_DIR}`
    );
    fs.mkdirSync(BPANEL_DIR);
  }

  if (!fs.existsSync(CONFIGS_FILE)) {
    console.log(
      `info: No configuration file found. Initializing one at ${CONFIGS_FILE}`
    );
    fs.appendFileSync(CONFIGS_FILE, configText);
  }

  if (!fs.existsSync(LOCAL_PLUGINS_DIR)) {
    console.log(
      `info: No local plugins directory file found. Creating one at ${LOCAL_PLUGINS_DIR}`
    );
    fs.mkdirSync(LOCAL_PLUGINS_DIR);
  }

  if (!fs.existsSync(SECRETS_FILE)) {
    console.log(`info: No secrets file found. Creating one at ${SECRETS_FILE}`);
    fs.appendFileSync(SECRETS_FILE, JSON.stringify({}));
  }

  if (!fs.existsSync(CLIENTS_DIR)) {
    console.log(
      `info: No clients directory file found. Creating one at ${CLIENTS_DIR}`
    );
    fs.mkdirSync(CLIENTS_DIR);
  }

  require('./version.js');
} catch (e) {
  console.error('There was a problem initializing the project: ', e.stack);
  process.exit(1);
}
