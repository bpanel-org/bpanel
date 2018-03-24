import React from 'react';
import PropTypes from 'prop-types';
import { Text, utils, widgetCreator } from '@bpanel/bpanel-ui';

const { connectTheme } = utils;

const Header = ({ statusIcon, network, bcoinUri, theme }) => (
  <div className="container">
    <div
      className={`${theme.headerbar.networkStatus} ml-md-auto text-right col`}
    >
      <div className="network text-uppercase">
        <Text className={theme.headerbar.text}>Status: {network} </Text>
        <i
          className={`${theme.headerbar.icon} fa fa-${statusIcon}`}
          areahidden="true"
        />
      </div>
      <div className="node">
        <Text className={`${theme.headerbar.nodeText} ${theme.headerbar.text}`}>
          Node:{' '}
        </Text>
        <Text className={`${theme.headerbar.text}`}>{bcoinUri}</Text>
      </div>
    </div>
  </div>
);

Header.propTypes = {
  theme: PropTypes.object,
  network: PropTypes.string,
  statusIcon: PropTypes.string,
  bcoinUri: PropTypes.string
};
export default widgetCreator(connectTheme(Header));
