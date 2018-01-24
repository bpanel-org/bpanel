import { UPDATE_THEME } from '../constants/theme';
import config from '../../config/appConfig';
import themeConfig from '../../config/themeConfig/';
import { decorateTheme } from '../../plugins/plugins';
const { themeCreator } = themeConfig;
const decoratedTheme = decorateTheme(themeCreator, config);

const themeReducer = (state = decoratedTheme, action) => {
  switch (action.type) {
    case UPDATE_THEME: {
      return action.payload;
    }

    default:
      return state;
  }
};

export default themeReducer;
