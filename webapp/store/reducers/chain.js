import { CHAIN_PROGRESS, SET_CHAIN } from '../constants/chain';
import { decorateReducer } from '../../plugins/plugins';

const initialState = {
  height: 0
};

const chainState = (state = initialState, action) => {
  let newState = { ...state };

  switch (action.type) {
    case SET_CHAIN: {
      newState = action.payload;
      return newState;
    }

    case CHAIN_PROGRESS: {
      const raw = action.payload;
      const progress = parseFloat(raw.toString('ascii'));
      // only update state if the change is noticeable
      if (state.progress && progress.toFixed(4) > state.progress.toFixed(4)) {
        newState.progress = progress;
      }
      return newState;
    }

    default:
      return state;
  }
};

export default decorateReducer(chainState, 'chainReducer');
