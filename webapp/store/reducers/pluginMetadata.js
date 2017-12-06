import { ADD_PLUGIN } from '../constants';
import { initialMetadata } from '../../utils/plugins';

const pluginMetadata = (state = initialMetadata(), action) => {
  let newState = { ...state };

  switch (action.type) {
    case ADD_PLUGIN: {
      const newPlugin = action.payload;
      if (!newState[newPlugin.name]) {
        newState[newPlugin.name] = newPlugin;
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
