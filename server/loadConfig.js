#!/bin/env node
// Merges config from ENV, secrets.env, & bcoin.env
// with ENV being highest priority

const fs = require('fs');
const url = require('url');
const path = require('path');
const dotenv = require('dotenv');

const temp = {};
const config = { uri: 'http://localhost:8332' };
const bcoinEnv = path.resolve(__dirname, '../bcoin.env');
const secretsEnv = path.resolve(__dirname, '../secrets.env');

// Load env files into temp
[bcoinEnv, secretsEnv].forEach(f => {
  if (fs.existsSync(f)) {
    Object.assign(temp, dotenv.parse(fs.readFileSync(f)));
  }
});

// Convert temp ENV vars that start with "BCOIN_"
Object.assign(temp, process.env);
for (let key in temp) {
  if (key.indexOf('BCOIN_') > -1) {
    const separatorIndex = key.indexOf('_');
    let value = temp[key];
    // convert boolean strings to booleans
    value = value === 'true' || value === 'false' ? JSON.parse(value) : value;
    let configKey = key.slice(separatorIndex + 1).toLowerCase();
    // change underscore to camelcase for config file
    configKey = configKey.replace(/_([a-z])/gi, (match, p1) =>
      p1.toUpperCase()
    );
    config[configKey] = value;
  }
}

// Update URI with port, host, and protocol from ENV
let { port, hostname, protocol } = url.parse(config.uri);
if (config.port) port = config.port;
if (config.host) hostname = config.host;
if (config.protocol) protocol = config.protocol;
// Set ssl if protocol is https but no ssl option was set
const ssl = config.ssl || config.uri.indexOf('https') > -1;

Object.assign(config, {
  uri: url.format({
    port,
    protocol,
    hostname
  }),
  ssl,
  port,
  protocol,
  host: hostname,
});

// console.debug({ config });
module.exports = config;
