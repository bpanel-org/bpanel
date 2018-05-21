const fs = require('fs');
const crypto = require('crypto');
const fname = 'secrets.env';

// need to provide the api key
// to both the bpanel server
// and the wallet server
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
