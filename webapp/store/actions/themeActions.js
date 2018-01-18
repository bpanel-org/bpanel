import { UPDATE_THEME } from '../constants/themes';

export function updateTheme(theme) {
  return {
    type: UPDATE_THEME,
    payload: theme
  };
}

export default {
  updateTheme
};
