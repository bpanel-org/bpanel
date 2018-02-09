import { UPDATE_THEME } from '../constants/theme';
import themeConfig from '../../config/themeConfig/';
import { decorateTheme } from '../../plugins/plugins';
const { themeCreator } = themeConfig;

export function updateTheme() {
  const theme = decorateTheme(themeCreator);
  document.body.className = theme.app.body;
  document.documentElement.className = theme.app.body;
  return {
    type: UPDATE_THEME,
    payload: theme
  };
}

export default {
  updateTheme
};
