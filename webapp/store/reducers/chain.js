import Immutable from 'seamless-immutable';

import { SET_CHAIN_INFO, SET_GENESIS } from '../constants/chain';
import { decorateReducer } from '../../plugins/plugins';

const initialState = Immutable({
  height: 0,
  progress: 0
});

const chainState = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAIN_INFO: {
      return state.merge(action.payload);
    }

    case SET_GENESIS: {
      return state.merge({ genesis: action.payload });
    }

    default:
      return state;
  }
};

export default decorateReducer(chainState, 'chainReducer');
