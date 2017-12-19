import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import bsockMiddleware from 'bsock-middleware';

import { getConstants } from '../plugins/plugins';
import * as reducers from './reducers';

const rootReducer = combineReducers(reducers);

const middleware = [thunkMiddleware];
let compose,
  debug = false;

// get extended listeners
const { listeners } = getConstants('sockets');

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
