import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, utils } from 'bpanel-ui';

const { connectTheme } = utils;

class Header extends PureComponent {
  static get propTypes() {
    return {
      theme: PropTypes.object,
      network: PropTypes.string,
      loading: PropTypes.bool,
      bcoinUri: PropTypes.string
    };
  }

  render() {
    const { loading, network, bcoinUri, theme } = this.props;
    const statusIcon = loading ? 'ellipsis-h' : 'check-circle';

    return (
      <div className="navbar" style={theme.headerbar.container}>
        <div
          className="ml-md-auto text-right col"
          style={theme.headerbar.networkStatus}
        >
          <div className="network text-uppercase">
            <Text style={theme.headerbar.text}>Status: {network} </Text>
            <i
              className={`fa fa-${statusIcon}`}
              areahidden="true"
              style={theme.headerbar.icon}
            />
          </div>
          <div className="node">
            <Text
              style={{ ...theme.headerbar.nodeText, ...theme.headerbar.text }}
            >
              Node:{' '}
            </Text>
            <Text style={theme.headerbar.text}>{bcoinUri}</Text>
          </div>
        </div>
      </div>
    );
  }
}

export default connectTheme(Header);
