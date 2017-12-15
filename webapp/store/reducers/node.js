import { SET_NODE, SET_LOADING, SET_BCOIN_URI } from '../constants/node';

const initialState = {
  node: {},
  chain: {},
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
      const { version, network, memory, mempool, time } = action.payload;
      newState.node = { version, network };
      newState.memory = memory;
      newState.mempool = mempool;
      newState.time = time;
      return newState;
    }

    case SET_LOADING:
      newState.loading = action.payload;
      return newState;

    case SET_BCOIN_URI:
      newState.serverInfo.bcoinUri = action.payload;
      return newState;

    default:
      return state;
  }
};

export default nodeState;
