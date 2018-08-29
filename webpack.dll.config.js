const webpack = require('webpack');
const path = require('path');

const vendorManifest = path.join(__dirname, 'dist', '[name]-manifest.json');

module.exports = {
  target: 'web',
  entry: {
    vendor: [
      'bcoin/lib/bcoin-browser',
      'bclient',
      'react',
      'react-redux',
      'react-dom',
      '@bpanel/bpanel-ui',
      '@bpanel/bpanel-utils'
    ]
  },
  output: {
    libraryTarget: 'umd',
    path: path.join(__dirname, 'dist'),
    library: '[name]_lib',
    filename: 'vendor.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['-browser.js', '.js', '.json']
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_lib',
      path: vendorManifest
    })
  ]
};
