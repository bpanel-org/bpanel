const path = require('path');
const loadConfig = require('./loadConfig');
const platform = process.platform;

// paths to webpack configs
const devWebpackPath = path.resolve(
  __dirname,
  '../../configs/webpack.config.js'
);
const prodWebpackPath = path.resolve(
  __dirname,
  '../../configs/webpack.prod.js'
);

module.exports = {
  parseArgs
};

function parseArgs({ module }) {
  // load application config
  const config = loadConfig('bpanel');

  // set default values
  const webpack = [];
  const server = [];
  let dev = false;
  let clear = false;
  let watch = false;
  let NODE_ENV = 'production';

  // TODO: cannot use module because that conflicts
  // with a value on the logger
  // need a value to say that this was not required
  config.set('nodemodule', module);
  config.set('dynamicclients', true);

  // parse config args for webpack and server
  for (const [arg, value] of Object.entries(config.args)) {
    switch (arg) {
      // turn on development mode
      case 'dev':
        // specifically dont add to server
        NODE_ENV = 'development';
        process.NODE_ENV = 'development';
        dev = true;
        break;

      case 'watch':
      case 'watchpoll':
        // use platform information to determine
        // how to watch
        // TODO: test with win32
        if (platform === 'darwin') {
          webpack.push('--watch', '--env.dev', '--env.poll');
          watch = true;
        } else webpack.push('--watch', '--env.dev');
        break;

      case 'clear':
        // specifically dont add to server
        clear = true;
        break;

      default:
        // pass along other arguments to server
        server.push(arg, value);
        break;
    }
  }

  if (dev) webpack.push('--config', devWebpackPath);
  else webpack.push('--config', prodWebpackPath);

  return {
    webpack,
    server,
    watch,
    dev,
    clear,
    config,
    dynamicClients: true,
    startWebpack: true
  };
}
