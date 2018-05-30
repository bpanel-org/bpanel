const assert = require('assert');
const fs = require('fs');
const fname = 'secrets.env';

const secretFileExists = fs.existsSync(fname);

// ensure secrets.env is up to date
const requiredSecrets = [
  'BCOIN_API_KEY',
  'BCOIN_NODE_API_KEY',
  'BCOIN_ADMIN_TOKEN'
];
if (secretFileExists) {
  const data = {};
  fs
    .readFileSync(fname)
    .toString()
    .split('\n')
    .filter(el => !!el) // remove extra newline
    .forEach(el => {
      const pair = el.split('=');
      assert(
        pair.length === 2,
        `Values in ${fname} must be in KEY=VALUE format`
      );
      data[pair[0]] = pair[1];
    });

  requiredSecrets.forEach(key => {
    assert(key in data, `Required secret missing: ${key}`);
    assert(
      data[key].match(/^[a-fA-F0-9]+$/),
      `Secret value for ${key} must be a hexidecimal string`
    );
  });
}
