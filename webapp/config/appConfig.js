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
    'bMoonTheme',
    'my-bpanel-admin'
  ],
  // This will be the list of plugins to install from npm
  // TODO: This system still needs to be built
  plugins: [],
  theme: {
    themeVariables,
    themeCreator
  }
};
