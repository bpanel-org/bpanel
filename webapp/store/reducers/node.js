const initialState = {
  node: {},
  loading: true
};
import { SET_NODE, SET_LOADING } from '../constants';

const nodeState = (state = initialState, action) => {
  let newState = { ...state };

  switch (action.type) {
    case SET_NODE:
      newState.node = action.payload;
      return action.payload;

    case SET_LOADING:
      newState.loading = action.payload;
      return newState;

    default:
      return state;
  }
};

export default nodeState;
