import Immutable from 'seamless-immutable';

import { UPDATE_THEME } from '../constants/themes';
import theme from '../../config/themeConfig/';

const themeReducer = (state = Immutable(theme), action) => {
  switch (action.type) {
    case UPDATE_THEME: {
      return action.payload;
    }

    default:
      return state;
  }
};

export default themeReducer;
