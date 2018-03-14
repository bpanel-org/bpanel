import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import bsockMiddleware from 'bsock-middleware';
import effects from 'effects-middleware';

import config from '../config/appConfig';
import { getConstants } from '../plugins/plugins';
import { loadPlugins, pluginMiddleware } from '../plugins/plugins';
import * as reducers from './reducers';

export default async () => {
  // load plugin information before setting up app and store
  await loadPlugins(config);

  const rootReducer = combineReducers(reducers);
  const middleware = [thunkMiddleware, pluginMiddleware, effects];
  let compose,
    debug = false;

  // get extended listeners
  const { listeners } = getConstants('sockets');

  if (envConfig.NODE_ENV === 'development') {
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

  const store = createStore(rootReducer, compose);
  return store;
};
