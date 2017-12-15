import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import store from './store';
import utils from './utils';

import App from './containers/App/App';

// setting a utils property on the window
// which will return our utility functions for plugins to use
Object.defineProperty(window, 'utils', {
  get: () => utils
});

render(
  <Provider store={store}>
    <Router>
      <Route component={App} />
    </Router>
  </Provider>,
  document.getElementById('app')
);
