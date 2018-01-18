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

export const decorateTheme = ({
  themeVariables: baseThemeVariables,
  themeConfig: baseThemeConfig
}) => {
  const themeVariables_ = baseThemeVariables.merge(themeVariables, {
    deep: true
  });
  const themeConfig_ = baseThemeConfig.merge(themeConfig, { deep: true });
  return {
    themeVariables: themeVariables_,
    themeConfig: themeConfig_
  };
};
