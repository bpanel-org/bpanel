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
      <footer className="fixed-bottom">
        <div className={`${theme.footer.container} d-flex align-items-center`}>
          {Array.isArray(footerWidgets) ? (
            footerWidgets.map((Widget, index) => <Widget key={index} />)
          ) : (
            <FooterWidget />
          )}
          {CustomChildren && <CustomChildren />}
        </div>
      </footer>
    );
  }
}

export default connectTheme(Footer);
