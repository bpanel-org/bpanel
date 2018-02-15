import theme from './themeConfig/index.js';

const { themeVariables, themeCreator } = theme;

export default {
  // localPlugins are for either development of a plugin or
  // for default/built-in plugins
  localPlugins: [
    'chainSockets',
    'dashboard',
    'mempool',
    'bui',
    'bpanel-theme',
    'bMoonTheme'
  ],
  // This is is a list of plugins to install from node_modules
  plugins: [],
  theme: {
    themeVariables,
    themeCreator
  }
};
