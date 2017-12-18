import { SET_CHAIN, ADD_BLOCK } from '../constants/chain';
import { decorateReducer } from '../../plugins/plugins';

const initialState = {
  height: 0
};

const chainState = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case SET_CHAIN: {
      const { progress } = action.payload;
      if (!state.progress) {
        newState = action.payload;
      } else if (progress.toFixed(4) > state.progress.toFixed(4)) {
        newState = action.payload;
      }
      return newState;
    }

    case ADD_BLOCK: {
      // console.log(action.payload);
      // const newBlock = action.payload;

      // newState[newBlock.height] = newBlock;
      // const oldestHeight = newBlock.height - RECENT_BLOCKS;
      // if (newState[oldestHeight]) {
      //   // if this height exists in state, remove it
      //   newState.delete(oldestHeight);
      // }

      return newState;
    }

    default:
      return state;
  }
};

export default decorateReducer(chainState, 'chainReducer');
