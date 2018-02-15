import Immutable from 'seamless-immutable';

import { ADD_PLUGIN } from '../constants/plugins';
import { initialMetadata } from '../../plugins/plugins';

const initialPlugins = initialMetadata();

const pluginMetadata = (state = Immutable(initialPlugins), action) => {
  switch (action.type) {
    case ADD_PLUGIN: {
      const newPlugin = action.payload;
      if (!state.getIn([newPlugin.name])) {
        return state.setIn([newPlugin.name], newPlugin);
        // TODO call a reload function to reload plugins
      } else {
        throw new Error(`${newPlugin.name} already exists`);
      }
    }

    default:
      return state;
  }
};

export default pluginMetadata;
