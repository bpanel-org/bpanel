import themeVariables from './themeVariables';
import themeConfig from './themeConfig';

export const metadata = {
  name: 'bDarkTheme',
  author: 'bcoin-org',
  theme: true
};

export const decorateTheme = themeCreator => () =>
  themeCreator(themeVariables, themeConfig);
