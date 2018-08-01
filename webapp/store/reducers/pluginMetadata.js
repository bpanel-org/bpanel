import { ADD_PLUGIN_META } from '../constants/plugins';
import { initialMetadata } from '../../plugins/plugins';

const initialPlugins = initialMetadata();
const pluginMetadata = (state = initialPlugins, action) => {
  switch (action.type) {
    case ADD_PLUGIN_META: {
      const newPlugin = action.payload;
      if (!state[newPlugin.name]) {
        return Object.assign({}, state, { [newPlugin.name]: newPlugin });
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
