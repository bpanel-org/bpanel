import React from 'react';
import PropTypes from 'prop-types';

import './footer.scss';

const Footer = ({ version, progress }) => {
  const progressPercentage = progress * 100;

  return (
    <footer className="row footer-container align-items-center">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-3 version text-truncate">{version}</div>
          <div className="col-3 progress">
            {progressPercentage.toFixed(2)}% synced
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  version: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Footer;
