import { ADD_SIDE_NAV, REMOVE_SIDE_NAV } from '../constants/nav';
import { initialMetadata } from '../../plugins/plugins';
import { sortedNavItems } from '../selectors/nav';

const pluginMetadata = initialMetadata();
const initialState = {
  sidebar: []
};

const navStore = (state = initialState, action) => {
  const newState = { ...state };
  const { type, payload } = action;

  switch (type) {
    case ADD_SIDE_NAV: {
      const sidebar = [...newState.sidebar, payload];
      newState.sidebar = sidebar;
      return newState;
    }

    case REMOVE_SIDE_NAV: {
      const sidebar = [...newState.sidebar];
      const index = sidebar.findIndex(
        item => item.name === payload.name || item.pathName === payload.pathName
      );
      sidebar.splice(index, 1);
      newState.sidebar = sidebar;
      return newState;
    }

    default:
      // default to nav from pluginMetadata
      if (!newState.sidebar.length)
        newState.sidebar = sortedNavItems({ pluginMetadata });
      return newState;
  }
};

export default navStore;
