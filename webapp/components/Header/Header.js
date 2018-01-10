import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as UI from 'bpanel-ui';

const { components: { Text }, utils: { connectTheme } } = UI;

class Header extends PureComponent {
  static get propTypes() {
    return {
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
            <Text>Status: {network} </Text>
            <i
              className={`fa fa-${statusIcon}`}
              areahidden="true"
              style={theme.headerbar.icon}
            />
          </div>
          <div className="node">
            <Text style={theme.headerbar.nodeText}>Node: </Text>
            <Text>{bcoinUri}</Text>
          </div>
        </div>
      </div>
    );
  }
}

export default connectTheme(Header);
