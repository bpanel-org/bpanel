import React from 'react';
// import PropTypes from 'prop-types';
import './sidebar.scss';

const Sidebar = () => {
  const commitHash = process.env.__COMMIT__.slice(0, 7);
  const version = process.env.__VERSION__;
  return (
    <nav className="col-3 d-flex flex-column sidebar">
      <div className="nav-item">Stuff</div>
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
