const path = require('path');

const resolveRoot = function(module) {
  const pkgPath = require.resolve(path.join(module, 'package.json'));
  const pathArray = pkgPath.split('/');
  pathArray.pop();
  return pathArray.join('/');
};

exports.resolveRoot = resolveRoot;
