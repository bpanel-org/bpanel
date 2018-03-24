import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@bpanel/bpanel-ui';

const { connectTheme } = utils;

class Footer extends PureComponent {
  static get propTypes() {
    return {
      footerWidgets: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.func),
        PropTypes.func
      ]),
      CustomChildren: PropTypes.node,
      theme: PropTypes.object
    };
  }

  static get defaultProps() {
    return {
      footerWidgets: []
    };
  }

  render() {
    const { footerWidgets, CustomChildren, theme } = this.props;
    let FooterWidget;
    if (!Array.isArray(footerWidgets)) FooterWidget = footerWidgets;
    return (
      <div className="container-fluid">
        <footer className={`${theme.footer.container} row align-items-center`}>
          {Array.isArray(footerWidgets) ? (
            footerWidgets.map((Widget, index) => <Widget key={index} />)
          ) : (
            <FooterWidget />
          )}
          {CustomChildren && <CustomChildren />}
        </footer>
      </div>
    );
  }
}

export default connectTheme(Footer);
