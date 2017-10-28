// #!/bin/env node
const fs = require('fs');
const path = require('path');

const server = require('./server/server.js');
const configPath = path.resolve(__dirname, 'bcoin.config.json');
const configs = require(configPath);

// Reads ENV vars that start with "BCOIN_"
const envVars = process.env;
for (let key in envVars) {
  if (key.indexOf('BCOIN_') > -1) {
    const separatorIndex = key.indexOf('_');
    const value = envVars[key];
    const configKey = key.slice(separatorIndex + 1).toLowerCase();
    configs[configKey] = value;
  }
}

// write to config file
fs.writeFileSync(configPath, JSON.stringify(configs, null, 3));
