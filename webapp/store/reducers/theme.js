import { UPDATE_THEME } from '../constants/theme';
import themeConfig from '../../config/themeConfig/';
const { themeCreator } = themeConfig;

const themeReducer = (state = themeCreator(), action) => {
  switch (action.type) {
    case UPDATE_THEME: {
      return Object.assign({}, action.payload);
    }

    default:
      return state;
  }
};

export default themeReducer;
