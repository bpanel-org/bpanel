const assert = require('bsert');
const Config = require('bcfg');

function isBlacklisted(config, endpoint) {
  assert(config instanceof Config, 'Must pass a config to check blacklist');
  const blacklist = config.array('blacklist', []);

  for (let blacklisted of blacklist) {
    // if item in array is just a string, check against the path
    // must be an exact match
    if (typeof blacklisted === 'string' && blacklisted === endpoint.path)
      return true;
    // for objects, will check path and method match
    else if (
      blacklisted.path === endpoint.path &&
      blacklisted.method === endpoint.method
    )
      return true;
  }
  // if no match, confirm not blacklisted
  return false;
}

module.exports = {
  isBlacklisted
};
