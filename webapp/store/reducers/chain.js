import Immutable from 'seamless-immutable';

import { SET_CHAIN_TIP } from '../constants/chain';
import { decorateReducer } from '../../plugins/plugins';

const initialState = Immutable({
  height: 0,
  progress: 0
});

const chainState = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAIN_TIP: {
      return state.merge(action.payload);
    }

    default:
      return state;
  }
};

export default decorateReducer(chainState, 'chainReducer');
