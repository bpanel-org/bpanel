const webpack = require('webpack');
const path = require('path');

const { DIST_DIR, MODULES_DIR } = require('./constants');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const vendorManifest = path.join(DIST_DIR, '[name]-manifest.json');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: {
    vendor: [
      'bcoin/lib/bcoin-browser',
      'bcash/lib/bcoin-browser',
      'hsd/lib/hsd-browser',
      'bledger/lib/bledger-browser',
      'bmultisig/lib/bmultisig-browser',
      'hs-client',
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
    path: DIST_DIR,
    library: '[name]_lib',
    filename: 'vendor.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['-browser.js', '.js', '.json'],
    // list of aliases are what packages plugins can list as peerDeps
    // this helps simplify plugin packages and ensures that parent classes
    // all point to the same instance, e.g bcoin.TX will be same for all plugins
    alias: {
      bcoin$: `${MODULES_DIR}/bcoin/lib/bcoin-browser`,
      bcash$: `${MODULES_DIR}/bcash/lib/bcoin-browser`,
      hsd$: `${MODULES_DIR}/hsd/lib/hsd-browser`,
      'hs-client': `${MODULES_DIR}/hs-client`
    }
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_lib',
      path: vendorManifest
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};
