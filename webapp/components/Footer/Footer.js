import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { utils } from 'bpanel-ui';

const { connectTheme } = utils;

class Footer extends PureComponent {
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
