import theme from './themeConfig/index.js';
import localModules from '../plugins/local';

const { themeVariables, themeCreator } = theme;

// localPlugins are for either development of a plugin or
// for default/built-in plugins
const localPlugins = Object.keys(localModules).map(name => localModules[name]);

export default {
  // This is the list of plugins to install in our app
  plugins: [...localPlugins],
  theme: {
    themeVariables,
    themeCreator
  }
};
