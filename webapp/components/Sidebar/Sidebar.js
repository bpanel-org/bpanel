import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import './sidebar.scss';

const Sidebar = () => {
  const commitHash = process.env.__COMMIT__.slice(0, 7);
  const version = process.env.__VERSION__;
  return (
    <nav className="col-3 d-flex flex-column sidebar">
      <Link className="nav-item sidebar-item" to="/">
        Dashboard
      </Link>
      <Link className="nav-item sidebar-item" to="/wallets">
        Wallets
      </Link>
      <div className="sidebar-footer mt-auto text-center">
        <h5>bPanel</h5>
        <p className="version subtext text-truncate">version: {version}</p>
        <p className="commit subtext text-truncate">
          commit hash: {commitHash}
        </p>
      </div>
      <div className="col-sm-1" />
    </nav>
  );
};

export default Sidebar;
