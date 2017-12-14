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
import {
  SET_NODE,
  SET_LOADING,
  SET_BCOIN_URI,
  CHAIN_PROGRESS
} from '../constants/node';

const nodeState = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case SET_NODE: {
      const { version, network, chain, memory, mempool, time } = action.payload;
      newState.node = { version, network };
      newState.chain = chain;
      newState.memory = memory;
      newState.mempool = mempool;
      newState.time = time;
      return newState;
    }

    case CHAIN_PROGRESS: {
      const raw = action.payload;
      const progress = parseFloat(raw.toString('ascii'));
      // only update state if the change is noticeable
      if (
        state.chain.progress &&
        progress.toFixed(4) > state.chain.progress.toFixed(4)
      ) {
        newState.chain.progress = progress;
      }
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
