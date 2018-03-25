#!/bin/env node
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../configs/bcoin.config.json');

// We are going to clear the configs every time to make sure old
// configs don't conflict
// fs.writeFileSync(configPath, JSON.stringify({}));
const configs = require(configPath);

// Reads ENV vars that start with "BCOIN_"
const envVars = process.env;
for (let key in envVars) {
  if (key.indexOf('BCOIN_') > -1) {
    const separatorIndex = key.indexOf('_');
    const value = envVars[key];
    let configKey = key.slice(separatorIndex + 1).toLowerCase();
    // change underscore to camelcase for config file
    configKey = configKey.replace(/_([a-z])/gi, (match, p1) =>
      p1.toUpperCase()
    );
    configs[configKey] = value;
  }
}

// write to config file
fs.writeFileSync(configPath, JSON.stringify(configs, null, 3));
