const fs = require('fs');
const crypto = require('crypto');
const fname = 'secrets.env';

// three different clients need to
// use the same api key when bootstrapping
// a docker environment, they
// use different env variables
// to read the value so
// write the randomValue to
// different env vars which require different prefixes
// for different environments
const randomValue = crypto.randomBytes(40).toString('hex');

// Init secrets.env
if (!fs.existsSync(fname)) {
  fs.writeFileSync(
    fname,
    `BCOIN_API_KEY=${randomValue}
    BCOIN_NODE_API_KEY=${randomValue}
    BPANEL_API_KEY=${randomValue}`,
    { mode: 0o600 }
  );
}

// create webapp/version.json file
require('./version.js');
