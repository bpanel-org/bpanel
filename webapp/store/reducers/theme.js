import Immutable from 'seamless-immutable';
import { UPDATE_THEME } from '../constants/theme';
import { decorateTheme } from '../../plugins/plugins';
import themeConfig from '../../config/themeConfig/';
const { themeCreator } = themeConfig;

const themeReducer = (state = Immutable(themeCreator()), action) => {
  switch (action.type) {
    case UPDATE_THEME: {
      return state.merge(action.payload, { deep: true });
    }

    default:
      return state;
  }
};

export default themeReducer;
