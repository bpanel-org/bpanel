const fs = require('fs');
const crypto = require('crypto');
const fname = 'secrets.env';

// Init secrets.env
if (!fs.existsSync(fname)) {
  fs.writeFileSync(
    fname,
    'BCOIN_API_KEY=' + crypto.randomBytes(40).toString('hex') + '\n',
    { mode: 0o600 }
  );
}

require('./version.js')
