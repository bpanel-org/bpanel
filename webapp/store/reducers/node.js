import { decorateReducer } from '../../plugins/plugins';
import { SET_NODE, SET_LOADING, SET_BCOIN_URI } from '../constants/node';

const initialState = {
  node: {},
  memory: {},
  mempool: {},
  time: {},
  loading: true,
  serverInfo: {
    bcoinUri: '0.0.0.0'
  }
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

    case SET_BCOIN_URI:
      // TODO: use safeSet
      if (!('serverInfo' in newState)) {
        newState.serverInfo = {};
      }
      newState.serverInfo.bcoinUri = action.payload;
      return newState;

    default:
      return state;
  }
};

export default decorateReducer(nodeState, 'nodeReducer');
