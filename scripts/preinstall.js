const fs = require('bfile');
const os = require('os');
const path = require('path');

const configsDir = path.resolve(os.homedir(), '.bpanel');
const configsFile = path.resolve(configsDir, './config.js');
const clientsDir = path.resolve(configsDir, 'clients');

const configText = `module.exports = {
  plugins: ['@bpanel/genesis-theme'],
  localPlugins: [],
}`;
if (!fs.existsSync(configsDir)) fs.mkdirSync(configsDir);
if (!fs.existsSync(configsFile)) {
  fs.appendFileSync(configsFile, configText);
}
if (!fs.existsSync(clientsDir)) fs.mkdirSync(clientsDir);

require('./version.js');
