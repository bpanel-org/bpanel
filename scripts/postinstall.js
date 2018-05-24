const fs = require('fs');
const crypto = require('crypto');
const fname = 'secrets.env';

// two different clients need to
// use the same api key, they
// use different env variables
// to read the value so
// write the randomValue to two
// different env vars
const randomValue = crypto.randomBytes(40).toString('hex');

// Init secrets.env
if (!fs.existsSync(fname)) {
  fs.writeFileSync(
    fname,
    `BCOIN_API_KEY=${randomValue}
    BCOIN_NODE_API_KEY=${randomValue}`,
    { mode: 0o600 }
  );
}

// create webapp/version.json file
require('./version.js');
