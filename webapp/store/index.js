import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import bsockMiddleware from 'bsock-middleware';
import effects from 'effects-middleware';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { getConstants } from '../plugins/plugins';
import {
  loadPlugins,
  pluginMiddleware,
  getPluginReducers,
  getPersistWhiteList
} from '../plugins/plugins';
import * as reducers from './reducers';

function errorCatcherMiddleware(errorHandler) {
  return function(store) {
    return function(next) {
      return function(action) {
        try {
          return next(action);
        } catch (err) {
          const message = `There was an error in the middleware for the action ${
            action.type
          }: `;
          errorHandler(message, err, store.getState, action, store.dispatch);
          return err;
        }
      };
    };
  };
}

export default async () => {
  // load plugin information before setting up app and store
  const appConfig = await import('../config/appConfig');
  const config = await appConfig.default();
  await loadPlugins(config);

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
  const pluginReducers = getPluginReducers()
    ? persistReducer(pluginsPersistConfig, getPluginReducers())
    : null;

  const rootReducer = combineReducers({
    ...reducers,
    plugins: pluginReducers
  });

  const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

  const middleware = [
    // eslint-disable-next-line no-console
    errorCatcherMiddleware(console.error),
    thunkMiddleware,
    pluginMiddleware,
    effects
  ];
  let compose,
    debug = false;

  // get extended listeners
  const { listeners } = getConstants('sockets');

  if (NODE_ENV === 'development') {
    const composeEnhancers = composeWithDevTools({
      autoPause: true,
      maxAge: 10
    });
    debug = true;
    middleware.push(bsockMiddleware({ debug, listeners }));
    compose = composeEnhancers(applyMiddleware(...middleware));
  } else {
    middleware.push(bsockMiddleware({ debug, listeners }));
    compose = applyMiddleware(...middleware);
  }

  const store = createStore(persistedReducer, compose);
  persistStore(store);
  return store;
};
