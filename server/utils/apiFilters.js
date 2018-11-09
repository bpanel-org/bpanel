const assert = require('bsert');
const Config = require('bcfg');

function isMatch(src, regexpOrString) {
  if (regexpOrString instanceof RegExp)
    return Boolean(src.match(regexpOrString));
  else if (typeof regexpOrString === 'string')
    return Boolean(src.match(RegExp(regexpOrString)));
  throw new TypeError(
    `Expected either a string or RegExp, instead received ${typeof regexpOrString}`
  );
}

function isBlacklisted(config, endpoint) {
  assert(config instanceof Config, 'Must pass a config to check blacklist');
  const blacklist = config.array('blacklist', []);
  const { path, method } = endpoint;
  for (let blacklisted of blacklist) {
    // if item in array is just a string, check against the path
    // must be an exact match
    if (
      (typeof blacklisted === 'string' || blacklisted instanceof RegExp) &&
      isMatch(path, blacklisted)
    )
      return true;
    // for objects, will check path and method match
    else if (blacklisted.method === method && isMatch(path, blacklisted.path))
      return true;
  }
  // if no match, confirm not blacklisted
  return false;
}

module.exports = {
  isBlacklisted
};
