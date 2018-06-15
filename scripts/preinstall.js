const fs = require('fs');
const os = require('os');
const path = require('path');

const configsDir = path.resolve(os.homedir(), '.bpanel');
const clientsDir = path.resolve(configsDir, 'clients');

if (!fs.existsSync(configsDir)) fs.mkdirSync(configsDir);

if (!fs.existsSync(clientsDir)) fs.mkdirSync(clientsDir);

require('./version.js');
