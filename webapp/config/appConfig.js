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

export default async function() {
  const [...plugins] = await modules();
  const [...localPlugins] = await localModules();
  return {
    plugins: [...localPlugins, ...plugins],
    theme: {
      themeVariables,
      themeCreator
    }
  };
}
