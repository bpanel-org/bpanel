import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ version, progress }) => (
  <footer className="row">
    {version}
    <div className="progress">{progress.toFixed(2) * 100}%</div>
  </footer>
);

Footer.propTypes = {
  version: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Footer;
