import React from 'react';
import PropTypes from 'prop-types';

import './header.scss';

const Header = ({ loading, network, bcoinUri }) => {
  const statusIcon = loading ? 'ellipsis-h' : 'check-circle';

  return (
    <div className="navbar header row">
      <div className="network-status ml-md-auto text-right col">
        <div className="network text-uppercase">
          Status: {network}{' '}
          <i className={`fa fa-${statusIcon} teal`} areahidden="true" />
        </div>
        <div className="node">
          <span className="blue">Node:</span> {bcoinUri}
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  network: PropTypes.string,
  loading: PropTypes.bool,
  bcoinUri: PropTypes.string
};

export default Header;
