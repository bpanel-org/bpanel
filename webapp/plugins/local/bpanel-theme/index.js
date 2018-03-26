import modules from './plugins';

const plugins = Object.keys(modules).map(name => modules[name]);

export const metadata = {
  name: 'bpanel-theme',
  description: 'Default theme with packaged plugins for bpanel GUI',
  author: 'bcoin-org',
  version: require('./package.json').version
};

export const pluginConfig = {
  plugins
};
