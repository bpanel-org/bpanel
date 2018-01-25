import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as UI from 'bpanel-ui';

const { utils: { connectTheme } } = UI;

class Footer extends Component {
  static get propTypes() {
    return {
      customChildren: PropTypes.node,
      theme: PropTypes.object
    };
  }

  render() {
    const { theme, customChildren } = this.props;
    return (
      <div className="container-fluid">
        <footer
          className="row align-items-center"
          style={theme.footer.container}
        >
          {customChildren}
        </footer>
      </div>
    );
  }
}

export default connectTheme(Footer);
