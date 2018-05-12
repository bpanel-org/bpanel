import { UPDATE_THEME } from '../constants/theme';
import themeConfig from '../../config/themeConfig/';
const { themeCreator } = themeConfig;

const themeReducer = (state = themeCreator(), action) => {
  let newState = { ...state };
  switch (action.type) {
    case UPDATE_THEME: {
      newState = action.payload;
      return newState;
    }

    default:
      return state;
  }
};

export default themeReducer;
