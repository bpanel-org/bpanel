import { decorateReducer } from '../../plugins/plugins';
import { SET_NODE, SET_LOADING } from '../constants/node';

const initialState = {
  node: {},
  memory: {},
  mempool: {},
  time: {},
  loading: true
};

const nodeState = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case SET_NODE: {
      const { version, network } = action.payload;
      const node = { version, network };
      newState = { ...newState, ...action.payload, node };
      return newState;
    }

    case SET_LOADING:
      newState.loading = action.payload;
      return newState;

    default:
      return state;
  }
};

export default decorateReducer(nodeState, 'nodeReducer');
