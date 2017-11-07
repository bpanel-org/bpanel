import React from 'react';
import PropTypes from 'prop-types';

import logo from '../../images/logo.png';
import './header.scss';

const Header = () => (
  <div className="navbar header">
    <div className="col-1">
      <div className="navbar-brand">
        <img src={logo} className="logo" width="60" height="60" />
      </div>
    </div>
    <div className="col-3">Going to display some network status info</div>
  </div>
);

export default Header;
