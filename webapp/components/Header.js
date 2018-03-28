import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@bpanel/bpanel-ui';

const { connectTheme } = utils;

class Header extends PureComponent {
  static get propTypes() {
    return {
      headerWidgets: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.func),
        PropTypes.func
      ]),
      CustomChildren: PropTypes.node,
      theme: PropTypes.object
    };
  }

  render() {
    const { headerWidgets = [], CustomChildren, theme } = this.props;
    let HeaderWidget;
    if (!Array.isArray(headerWidgets)) HeaderWidget = headerWidgets;
    return (
      <div className={`${theme.headerbar.container} navbar`}>
        {Array.isArray(headerWidgets) ? (
          headerWidgets.map((Widget, index) => <Widget key={index} />)
        ) : (
          <HeaderWidget />
        )}
        {CustomChildren && <CustomChildren />}
      </div>
    );
  }
}

export default connectTheme(Header);
