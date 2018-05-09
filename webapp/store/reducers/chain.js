import { SET_CHAIN_INFO, SET_GENESIS } from '../constants/chain';
import { decorateReducer } from '../../plugins/plugins';

const initialState = {
  height: 0,
  progress: 0
};

const chainState = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAIN_INFO: {
      return Object.assign({}, state, action.payload);
    }

    case SET_GENESIS: {
      return Object.assign({}, state, { genesis: action.payload });
    }

    default:
      return state;
  }
};

export default decorateReducer(chainState, 'chainReducer');
