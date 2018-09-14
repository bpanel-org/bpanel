const path = require('path');
const os = require('os');

const { MODULES_DIR } = require('./constants');

// can be passed by server process via bcfg interface
// or passed manually when running webpack from command line
// defaults to `~/.bpanel`
const bpanelPrefix =
  process.env.BPANEL_PREFIX || path.resolve(os.homedir(), '.bpanel');

module.exports = {
  resolve: {
    symlinks: false,
    extensions: ['-browser.js', '.js', '.json', '.jsx'],
    // list of aliases are what packages plugins can list as peerDeps
    // this helps simplify plugin packages and ensures that parent classes
    // all point to the same instance, e.g bcoin.TX will be same for all plugins
    alias: {
      bcoin$: `${MODULES_DIR}/bcoin/lib/bcoin-browser`,
      bcash$: `${MODULES_DIR}/bcash/lib/bcoin-browser`,
      hsd$: `${MODULES_DIR}/hsd/lib/hsd-browser`,
      bledger: `${MODULES_DIR}/bledger/lib/bledger-browser`,
      bmultisig: `${MODULES_DIR}/bmultisig/lib/bmultisig-browser`,
      react: `${MODULES_DIR}/react`,
      'react-redux': `${MODULES_DIR}/react-redux`,
      'react-loadable': `${MODULES_DIR}/react-loadable`,
      '&local': path.resolve(bpanelPrefix, 'local_plugins'),
      '@bpanel/bpanel-utils': `${MODULES_DIR}/@bpanel/bpanel-utils`,
      '@bpanel/bpanel-ui': `${MODULES_DIR}/@bpanel/bpanel-ui`,
      tinycolor: 'tinycolor2'
    }
  }
};
