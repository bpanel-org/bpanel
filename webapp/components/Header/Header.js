import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import { utils } from 'bpanel-ui';

const { connectTheme } = utils;

class Header extends PureComponent {
  static get propTypes() {
    return {
      customChildren: PropTypes.node,
      theme: PropTypes.object
    };
  }

  render() {
    const { customChildren, theme } = this.props;

    return (
      <div className={`${css(theme.headerbar.container)} navbar`}>
        {customChildren}
      </div>
    );
  }
}

export default connectTheme(Header);
