import React from 'react';
import PropTypes from 'prop-types';
import { Text, utils } from '@bpanel/bpanel-ui';

const { connectTheme } = utils;

const Footer = ({ progress, version, customChildren, theme }) => (
  <div className="container">
    <div className="row align-items-center">
      <div className="col-3 version text-truncate">
        <Text className={theme.footer.text}>{version}</Text>
      </div>
      <div className={`${theme.footer.progress} col-3`}>
        <Text className={theme.footer.text}>{progress.toFixed(2)}% synced</Text>
      </div>
      {customChildren}
    </div>
  </div>
);

Footer.propTypes = {
  theme: PropTypes.object,
  version: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  customChildren: PropTypes.node
};

export default connectTheme(Footer);
