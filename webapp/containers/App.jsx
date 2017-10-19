import React from 'react';
import PropTypes from 'prop-types';

import '../styles/app.scss';

const App = ({ children }) => (
  <div className="app-container" role="main">
    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;