const path = require('path');
const webpack = require('webpack');

const ROOT_DIR = __dirname;
const MODULES_DIR = path.resolve(ROOT_DIR, 'node_modules');

module.exports = {
  target: 'web',
  entry: './static/recent-blocks.js',
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'recent-blocks-bundle.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['-browser.js', '.js', '.json'],
    alias: {
      '@bpanel/bpanel-utils': `${MODULES_DIR}/@bpanel/bpanel-utils`,
      bcash$: `${MODULES_DIR}/bcash/lib/bcoin-browser`,
      bcoin$: `${MODULES_DIR}/bcoin/lib/bcoin-browser`,
      bcrypto: `${MODULES_DIR}/bcrypto`,
      bledger: `${MODULES_DIR}/bledger/lib/bledger-browser`,
      bmultisig: `${MODULES_DIR}/bmultisig/lib/bmultisig-browser`,
      bsert: `${MODULES_DIR}/bsert`,
      hsd$: `${MODULES_DIR}/hsd/lib/hsd-browser`
    }
  }
};
