import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import * as reducers from './reducers';

const rootReducer = combineReducers(reducers);

const middleware = [thunkMiddleware];
let compose;

if (process.env.NODE_ENV === 'development') {
  compose = composeWithDevTools(applyMiddleware(...middleware));
} else {
  compose = applyMiddleware(...middleware);
}

const store = createStore(rootReducer, compose);

export default store;
