import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { getPluginReducers, getPersistWhiteList } from '../plugins/plugins';
import * as reducers from './reducers';

export default function getPersistedReducer() {
  const rootPersistConfig = {
    key: 'root',
    storage,
    whitelist: []
  };

  const pluginsPersistConfig = {
    key: 'plugins',
    storage,
    whitelist: getPersistWhiteList()
  };

  // persistReducer will break the store if there are no
  // plugin reducers to pass it so set to null if getPluginReducers()
  // doesn't pass anything
  let pluginReducers = getPluginReducers();
  pluginReducers = pluginReducers
    ? persistReducer(pluginsPersistConfig, pluginReducers)
    : null;

  const appReducers = combineReducers({
    ...reducers,
    plugins: pluginReducers
  });

  const rootReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
      // need to clear local storage as well so it's not persisted
      Object.keys(state).forEach(key => {
        storage.removeItem(`persist:${key}`);
      });
      Object.keys(state.plugins).forEach(key => {
        state.plugins[key] = undefined;
      });
      state.chain = undefined;
      state.wallets = undefined;
      state.node = undefined;
      state.plugins = undefined;
    }

    return appReducers(state, action);
  };

  return persistReducer(rootPersistConfig, rootReducer);
}
