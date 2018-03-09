import theme from './themeConfig/index.js';
import localModules from '../plugins/local';
import modules from '../plugins';

const { themeVariables, themeCreator } = theme;

let localPlugins = [];
let plugins = [];

// localPlugins are for either development of a plugin or
// for default/built-in plugins
// Here we are importing the local and published modules
// so they can be exported as part of our config

const getModuleList = moduleObject =>
  Object.keys(moduleObject).map(name => moduleObject[name]);

if (localModules) localPlugins = getModuleList(localModules);
if (plugins) plugins = getModuleList(modules);

export default {
  // This is the list of plugins to install in our app
  plugins: [...localPlugins, ...plugins],
  theme: {
    themeVariables,
    themeCreator
  }
};
