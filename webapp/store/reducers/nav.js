import { ADD_SIDE_NAV, REMOVE_SIDE_NAV, SET_SIDE_NAV } from '../constants/nav';

const initialState = {
  sidebar: []
};

const navStore = (state = initialState, action) => {
  const newState = { ...state };
  const { type, payload } = action;

  switch (type) {
    case ADD_SIDE_NAV: {
      const duplicates = newState.sidebar.some(
        nav => nav.name === payload.name || (!!nav.id && nav.id === payload.id)
      );

      if (duplicates)
        // eslint-disable-next-line no-console
        console.error(`Can't have duplicate names or ids for nav items`);
      else newState.sidebar = [...newState.sidebar, payload];

      return newState;
    }

    case REMOVE_SIDE_NAV: {
      const sidebar = [...newState.sidebar];
      const index = sidebar.findIndex(
        item => item.name === payload.name || item.id === payload.id
      );
      sidebar.splice(index, 1);
      newState.sidebar = sidebar;
      return newState;
    }

    case SET_SIDE_NAV: {
      if (!newState.sidebar.length) newState.sidebar = payload;
      return newState;
    }

    default:
      return newState;
  }
};

export default navStore;
