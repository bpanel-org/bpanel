import themeVariables from './themeVariables';
import themeConfig from './themeConfig';

export const metadata = {
  name: 'bMoonTheme',
  author: 'bcoin-org',
  order: 0,
  sidebar: false,
  theme: true,
  parent: ''
};

export const decorateTheme = themeCreator => () =>
  themeCreator(themeVariables, themeConfig);
