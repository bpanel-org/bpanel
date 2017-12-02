import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './containers/App/App';
import { loadPlugins } from './utils/plugins';

loadPlugins();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
