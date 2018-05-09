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
  switch (action.type) {
    case SET_NODE: {
      const { version, network, memory, mempool, time } = action.payload;
      const node = { version, network };
      return Object.assign({}, state, { node, memory, mempool, time });
    }

    case SET_LOADING:
      return Object.assign({}, state, { loading: action.payload });

    case SET_BCOIN_URI:
      return Object.assign({}, state, {
        serverInfo: { bcoinUri: action.payload }
      });

    default:
      return state;
  }
};

export default decorateReducer(nodeState, 'nodeReducer');
