import { SET_CHAIN_TIP } from '../constants/chain';
import { decorateReducer } from '../../plugins/plugins';

const initialState = {
  height: 0
};

const chainState = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case SET_CHAIN_TIP: {
      const { progress, height, time, tip } = action.payload;
      if (!state.progress) {
        newState = action.payload;
      } else if (progress.toFixed(4) > state.progress.toFixed(4)) {
        newState.progress = progress;
        newState.time = time;
        newState.height = height;
        newState.tip = tip;
      }
      return newState;
    }

    default:
      return state;
  }
};

export default decorateReducer(chainState, 'chainReducer');
