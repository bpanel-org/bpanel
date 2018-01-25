import { UPDATE_THEME } from '../constants/theme';

export function updateTheme(theme) {
  return {
    type: UPDATE_THEME,
    payload: theme
  };
}

export default {
  updateTheme
};
