import theme from './themeConfig/index.js';

const { themeVariables, themeConfig } = theme;

export default {
  // localPlugins are for either development of a plugin or
  // for default/built-in plugins
  localPlugins: ['dashboard', 'wallets', 'bui', 'mempool', 'bMoonTheme'],
  // This will be the list of plugins to install from npm
  // This system still needs to be built
  plugins: [],
  theme: {
    themeVariables,
    themeConfig
  }
};
