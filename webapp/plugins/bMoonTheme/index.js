import themeVariables from './themeVariables';
import themeConfig from './themeConfig';

export const metadata = {
  name: 'bMoonTheme',
  author: 'bcoin-org',
  theme: true
};

export const decorateTheme = themeCreator => () =>
  themeCreator(themeVariables, themeConfig);
