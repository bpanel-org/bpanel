import Immutable from 'seamless-immutable';

import { SET_CHAIN_TIP } from '../constants/chain';
import { decorateReducer } from '../../plugins/plugins';

const initialState = Immutable({
  height: 0
});

function Chain(obj) {
  return Immutable({});
}

const chainState = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case SET_CHAIN_TIP: {
      const { progress, height, time, tip } = action.payload;
      //      if (!state.progress) {
      //        newState = action.payload;
      //      } else {
      //        newState.progress = progress;
      //        newState.time = time;
      //        newState.height = height;
      //        newState.tip = tip;
      //      }
      //      return newState;
      return state.merge(action.payload);
    }

    default:
      return state;
  }
};

export default decorateReducer(chainState, 'chainReducer');
