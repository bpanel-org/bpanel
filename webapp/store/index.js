import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import bsockMiddleware from 'bsock-middleware';

import { socketListeners as listeners } from './constants/sockets';
import * as reducers from './reducers';

const rootReducer = combineReducers(reducers);

const middleware = [thunkMiddleware, promiseMiddleware()];
let compose,
  debug = false;

if (process.env.NODE_ENV === 'development') {
  const composeEnhancers = composeWithDevTools({ autoPause: true, maxAge: 20 });
  debug = true;
  middleware.push(bsockMiddleware({ debug, listeners }));
  compose = composeEnhancers(applyMiddleware(...middleware));
} else {
  middleware.push(bsockMiddleware({ debug, listeners }));
  compose = applyMiddleware(...middleware);
}

const store = createStore(rootReducer, compose);

export default store;
