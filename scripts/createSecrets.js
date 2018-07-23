const crypto = require('crypto');

/*
 * Use this script to generate secrets that can be used to secure bcoin
 */

const randomValue = crypto.randomBytes(40).toString('hex');
// admin token must be 32 bytes
const adminToken = crypto.randomBytes(32).toString('hex');

// only log secrets if ran from the command line
if (require.main === module) {
  console.log(`Secret Key: ${randomValue}`);
  console.log(`Admin Token: ${adminToken}`);
}

module.exports = {
  randomValue,
  adminToken
};
