import * as footerAddress from './localPlugins/footer-address';

export const metadata = {
  name: 'bpanel-theme',
  description: 'Default theme with packaged plugins for bpanel GUI',
  author: 'bcoin-org'
};

export const appConfig = {
  localPlugins: ['footer-address'],
  plugins: [],
  theme: {}
};

export const modules = {
  footerAddress
};
