import { UPDATE_THEME } from '../constants/theme';
import themeConfig from '../../config/themeConfig/';
import { decorateTheme } from '../../plugins/plugins';
const { themeCreator } = themeConfig;

export function updateTheme() {
  const theme = decorateTheme(themeCreator);
  for (const k in theme.app.body) {
    document.body.style[k] = theme.app.body[k];
    document.documentElement.style[k] = theme.app.body[k];
  }
  return {
    type: UPDATE_THEME,
    payload: theme
  };
}

export default {
  updateTheme
};
