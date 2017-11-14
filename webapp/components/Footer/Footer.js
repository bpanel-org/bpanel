import React from 'react';
import PropTypes from 'prop-types';

import './footer.scss';

const Footer = ({ version, progress }) => {
  const progressPercentage = progress * 100;

  return (
    <footer className="row align-items-center">
      <div className="col-3 version">{version}</div>
      <div className="col-3 progress ml-md-auto">
        {progressPercentage.toFixed(2)}% synced
      </div>
    </footer>
  );
};

Footer.propTypes = {
  version: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Footer;
