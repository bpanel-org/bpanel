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
// admin token must be 32 bytes
const adminToken = crypto.randomBytes(32).toString('hex');

const secretFileExists = fs.existsSync(fname);

const fileData = `BCOIN_API_KEY=${randomValue}
BCOIN_NODE_API_KEY=${randomValue}
BCOIN_ADMIN_TOKEN=${adminToken}`;

// create secrets.env if it does not exist
if (!secretFileExists) {
  fs.writeFileSync(fname, fileData, { mode: 0o600 });
}
