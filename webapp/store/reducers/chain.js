import { SET_CHAIN_INFO, SET_GENESIS } from '../constants/chain';
import { decorateReducer } from '../../plugins/plugins';

const initialState = {
  height: 0,
  progress: 0
};

const chainState = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case SET_CHAIN_INFO: {
      newState = { ...state, ...action.payload };
      return newState;
    }

    case SET_GENESIS: {
      newState.genesis = action.payload;
      return newState;
    }

    default:
      return state;
  }
};

export default decorateReducer(chainState, 'chainReducer');
