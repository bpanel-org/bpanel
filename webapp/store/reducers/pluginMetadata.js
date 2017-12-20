import { ADD_PLUGIN } from '../constants/plugins';
import { initialMetadata } from '../../plugins/plugins';

const initialPlugins = initialMetadata();

var pluginMetadata = (state = initialPlugins, action) => {
  let newState = { ...state };

  switch (action.type) {
    case ADD_PLUGIN: {
      var newPlugin = action.payload;
      if (!newState[newPlugin.name]) {
        newState[newPlugin.name] = newPlugin;
        // TODO call a reload function to reload plugins
      } else {
        throw new Error(`${newPlugin.name} already exists`);
      }
      return newState;
    }

    default:
      return state;
  }
};

export default pluginMetadata;
