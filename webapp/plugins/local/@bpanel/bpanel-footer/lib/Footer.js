import React from 'react';
import PropTypes from 'prop-types';
import { Text, utils, widgetCreator } from '@bpanel/bpanel-ui';

const { connectTheme } = utils;

const Footer = ({ progress, version, theme }) => (
  <div className="col-6">
    <div className="row align-items-center">
      <div className="col-6 version text-truncate">
        <Text className={theme.footer.text}>{version}</Text>
      </div>
      <div className={`${theme.footer.progress} col-6`}>
        <Text className={theme.footer.text}>{progress.toFixed(2)}% synced</Text>
      </div>
    </div>
  </div>
);

Footer.propTypes = {
  theme: PropTypes.object,
  version: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default widgetCreator(connectTheme(Footer));
