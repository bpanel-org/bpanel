import Immutable from 'seamless-immutable';

import { SET_NODE, SET_LOADING, SET_BCOIN_URI } from '../constants/node';

const initialState = Immutable({
  node: {},
  memory: {},
  mempool: {},
  time: {},
  loading: true,
  serverInfo: {
    bcoinUri: '0.0.0.0'
  }
});

const nodeState = (state = initialState, action) => {
  switch (action.type) {
    case SET_NODE: {
      const { version, network, memory, mempool, time } = action.payload;
      const node = { version, network };
      return state.merge({ node, memory, mempool, time });
    }

    case SET_LOADING:
      return state.set('loading', true);

    case SET_BCOIN_URI:
      return state.setIn(['serverInfo', 'bcoinUri'], action.payload);

    default:
      return state;
  }
};

export default nodeState;
