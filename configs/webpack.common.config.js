const path = require('path');
const os = require('os');
const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-synchronizable-shell-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { SRC_DIR, SERVER_DIR, ROOT_DIR } = require('./constants');
const { resolveRoot } = require('./utils');

// can be passed by server process via bcfg interface
// or passed manually when running webpack from command line
// defaults to `~/.bpanel`
const bpanelPrefix =
  process.env.BPANEL_PREFIX || path.resolve(os.homedir(), '.bpanel');

// socket port hard coded in since running on a different port from
// file server and http proxy
const BPANEL_SOCKET_PORT = process.env.BPANEL_SOCKET_PORT || 8000;
let SECRETS = {};
try {
  SECRETS = require(path.resolve(bpanelPrefix, 'secrets.json'));
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(
    `Couldn't find secrets.json in ${bpanelPrefix}. Make sure to run npm install to create boilerplate files`
  );
}

module.exports = () => ({
  resolve: {
    symlinks: false,
    extensions: ['-browser.js', '.js', '.json', '.jsx'],
    // list of aliases are what packages plugins can list as peerDeps
    // this helps simplify plugin packages and ensures that parent classes
    // all point to the same instance, e.g bcoin.TX will be same for all plugins
    alias: {
      '@bpanel/bpanel-utils': `${resolveRoot('@bpanel/bpanel-utils')}`,
      '@bpanel/bpanel-ui': `${resolveRoot('@bpanel/bpanel-ui')}`,
      bcash$: `${resolveRoot('bcash')}/lib/bcoin-browser`,
      bcoin$: `${resolveRoot('bcoin')}/lib/bcoin-browser`,
      bcrypto: `${resolveRoot('bcrypto')}`,
      bledger: `${resolveRoot('bledger')}/lib/bledger-browser`,
      bmultisig: `${resolveRoot('bmultisig')}/lib/bmultisig-browser`,
      bsert: `${resolveRoot('bsert')}`,
      hsd$: `${resolveRoot('hsd')}/lib/hsd-browser`,
      react: `${resolveRoot('react')}`,
      '&bpanel/pkg': `${ROOT_DIR}/pkg`,
      'react-dom': `${resolveRoot('react-dom')}`,
      'react-router': `${resolveRoot('react-router')}`,
      'react-router-dom': `${resolveRoot('react-router-dom')}`,
      'react-redux': `${resolveRoot('react-redux')}`,
      redux: `${resolveRoot('redux')}`,
      reselect: `${resolveRoot('reselect')}`,
      '&local': path.resolve(bpanelPrefix, 'local_plugins'),
      tinycolor: 'tinycolor2'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'bPanel - A Blockchain Management System',
      template: `${path.join(SRC_DIR, 'index.template.ejs')}`,
      inject: 'body'
    }),
    new WebpackShellPlugin({
      onBuildStart: {
        scripts: [
          `node ${path.resolve(SERVER_DIR, 'clear-plugins.js')}`,
          `node ${path.resolve(
            SERVER_DIR,
            'build-plugins.js'
          )} --prefix=${bpanelPrefix}`
        ]
      }
    }),
    new webpack.DefinePlugin({
      SECRETS: JSON.stringify(SECRETS),
      BPANEL_SOCKET_PORT: JSON.stringify(BPANEL_SOCKET_PORT),
      NODE_ENV: `"${process.env.NODE_ENV}"`,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BROWSER': JSON.stringify(true)
    })
  ]
});
