const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const SRC_DIR = path.resolve(ROOT_DIR, 'webapp');
const SERVER_DIR = path.resolve(ROOT_DIR, 'server');
const MODULES_DIR = path.resolve(ROOT_DIR, 'node_modules');

const resolveRoot = function(module) {
  const pkgPath = require.resolve(path.join(module, 'package.json'));
  const pathArray = pkgPath.split('/');
  pathArray.pop();
  return pathArray.join('/');
};

exports.ROOT_DIR = ROOT_DIR;
exports.DIST_DIR = DIST_DIR;
exports.SRC_DIR = SRC_DIR;
exports.SERVER_DIR = SERVER_DIR;
exports.MODULES_DIR = MODULES_DIR;
exports.resolveRoot = resolveRoot;
