import modules from './plugins';

const pluginModules = Object.keys(modules).map(name => modules[name]);

export const metadata = {
  name: 'my-bpanel-admin',
  description: 'Default theme with packaged plugins for bpanel GUI',
  author: 'bcoin-org',
  version: require('./package.json').version
};

export const pluginConfig = {
  pluginModules,
  theme: {}
};
