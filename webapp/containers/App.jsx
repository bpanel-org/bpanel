import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'bpanel-ux';

import '../styles/app.scss';

const App = ({ children }) => (
  <div className="app-container" role="main">
    {children}
    <Button type="default" onClick={() => console.log('Bar!')}>
      Foo
    </Button>
  </div>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
