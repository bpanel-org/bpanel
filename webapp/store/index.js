import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import bsockMiddleware from 'bsock-middleware';
import effects from 'effects-middleware';
import { persistStore } from 'redux-persist';

import { errorCatcherMiddleware, clientMiddleware } from './middleware';
import getPersistedReducer from './rootReducer';
import { getConstants } from '../plugins/plugins';
import { loadPlugins, pluginMiddleware } from '../plugins/plugins';

export default async () => {
  // load plugin information before setting up app and store
  const appConfig = await import('../config/appConfig');
  const config = await appConfig.default();
  await loadPlugins(config);
  const persistedReducer = getPersistedReducer();

  const middleware = [
    // eslint-disable-next-line no-console
    errorCatcherMiddleware(console.error),
    clientMiddleware,
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
