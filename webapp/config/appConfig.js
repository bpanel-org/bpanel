import theme from './themeConfig/index.js';

const { themeVariables, themeCreator } = theme;

export default {
  // localPlugins are for either development of a plugin or
  // for default/built-in plugins
  localPlugins: [
    'chainSockets',
    'dashboard',
    'mempool',
    'wallets',
    'bui',
    'bMoonTheme',
    'bpanel-footer'
  ],
  // This will be the list of plugins to install from npm
  // This system still needs to be built
  plugins: [],
  theme: {
    themeVariables,
    themeCreator
  }
};
