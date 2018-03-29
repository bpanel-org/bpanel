#!/bin/env node
// Merges config from ENV, bcoin.env, and secrets.env

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const temp = {};
const config = {};
const bcoinEnv = path.resolve(__dirname, '../bcoin.env');
const secretsEnv = path.resolve(__dirname, '../secrets.env');

for (const f of [bcoinEnv, secretsEnv]) {
  if (fs.existsSync(f)) {
    Object.assign(temp, dotenv.parse(fs.readFileSync(f)));
  }
}

Object.assign(temp, process.env);

// Reads ENV vars that start with "BCOIN_"
for (let key in temp) {
  if (key.indexOf('BCOIN_') > -1) {
    const separatorIndex = key.indexOf('_');
    const value = temp[key];
    let configKey = key.slice(separatorIndex + 1).toLowerCase();
    // change underscore to camelcase for config file
    configKey = configKey.replace(/_([a-z])/gi, (match, p1) =>
      p1.toUpperCase()
    );
    config[configKey] = value;
  }
}

// Set these manually
config.bpanelPort = process.env.PORT;
config.bsockPort = process.env.BSOCK_PORT;

module.exports = config;
