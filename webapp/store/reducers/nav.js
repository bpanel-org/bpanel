import { ADD_SIDE_NAV } from '../constants/nav';
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
      const sidebar = [...newState.sidebar];
      sidebar.push(payload);
      // sidebar = sortPluginMetadata(sidebar);
      // sidebar = getNestedPaths(sidebar);
      // sidebar = uniquePathNames(sidebar);
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
