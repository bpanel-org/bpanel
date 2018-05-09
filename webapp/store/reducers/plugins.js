/**
This is a bare-bones reducer that should be a catch-all
for custom reducers/state that plugins would like to
interact with.

When adding, payload should have a unique id for the
plugin's reducer you want add. If ID already exists,
it will be skipped.
**/

import { decorateReducer } from '../../plugins/plugins';
import { ADD_PLUGIN } from '../constants/plugins';

const initialState = {};

const plugins = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLUGIN: {
      const { id, ...rest } = action.payload;
      if (state[id])
        // reducer id already exists
        // return state without adding reducer
        // TODO: better reporting of duplicate reducer
        return state;
      // TODO: not sure if correct...
      return Object.assign({}, state, { id: { ...rest } });
    }

    default:
      return state;
  }
};

export default decorateReducer(plugins, 'pluginsReducer');
