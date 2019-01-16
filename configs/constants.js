const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const SRC_DIR = path.resolve(ROOT_DIR, 'webapp');
const SERVER_DIR = path.resolve(ROOT_DIR, 'server');
const MODULES_DIR = path.resolve(ROOT_DIR, 'node_modules');

const resolveRoot = function(module) {
  const moduleMain = require.resolve(module);
  const pathArray = moduleMain.split('/');

  // Handle @-scoped module names
  const moduleName = module.split('/').pop();

  // Find the module root directory
  // Only works when root directory has same name as module
  while (pathArray.pop() !== moduleName) {
    if (pathArray.length === 0)
      throw new Error(`Could not resolve path for module ${module}`);
  }

  pathArray.push(moduleName);
  const resolved = pathArray.join('/');
  return resolved;
};

exports.ROOT_DIR = ROOT_DIR;
exports.DIST_DIR = DIST_DIR;
exports.SRC_DIR = SRC_DIR;
exports.SERVER_DIR = SERVER_DIR;
exports.MODULES_DIR = MODULES_DIR;
exports.resolveRoot = resolveRoot;
