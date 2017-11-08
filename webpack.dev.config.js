const webpack = require('webpack');
const base = require('./webpack.config.js');

const devConfigs = Object.assign(base, {});

devConfigs.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  })
);

module.exports = devConfigs;
