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

  const rootReducer = combineReducers({
    ...reducers,
    plugins: pluginReducers
  });

  return persistReducer(rootPersistConfig, rootReducer);
}
