import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { getStore } from './store';
import App from './containers/App/App';

(async () => {
  const store = await getStore();
  render(
    <Provider store={store}>
      <Router>
        <Route component={App} />
      </Router>
    </Provider>,
    document.getElementById('app')
  );
})();
