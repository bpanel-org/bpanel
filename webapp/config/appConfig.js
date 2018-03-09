import theme from './themeConfig/index.js';
import localModules from '../plugins/local';
import modules from '../plugins';

const { themeVariables, themeCreator } = theme;

// Here we are importing the local and published modules
// from their respective entry points so they
// can be exported as part of our config
// localPlugins are typically for either development of a plugin or
// for default/built-in plugins
// IMPORTANT: plugins should be added via the pluginsConfig, not here
let localPlugins = [];
let plugins = [];

const getModuleList = moduleObject =>
  Object.keys(moduleObject).map(name => moduleObject[name]);

if (localModules) localPlugins = getModuleList(localModules);
if (plugins) plugins = getModuleList(modules);

export default {
  plugins: [...localPlugins, ...plugins], // don't edit this
  theme: {
    themeVariables,
    themeCreator
  }
};
