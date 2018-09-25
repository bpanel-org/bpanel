import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { utils, Text, Link } from '@bpanel/bpanel-ui';

const { connectTheme } = utils;

class Footer extends PureComponent {
  static get propTypes() {
    return {
      footerWidgets: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.func),
        PropTypes.func
      ]),
      CustomChildren: PropTypes.node,
      theme: PropTypes.object,
      hideFooterAttribution: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      footerWidgets: [],
      hideFooterAttribution: false
    };
  }

  render() {
    const {
      footerWidgets,
      CustomChildren,
      theme,
      hideFooterAttribution
    } = this.props;
    let FooterWidget;
    if (!Array.isArray(footerWidgets)) FooterWidget = footerWidgets;
    return (
      <footer className="fixed-bottom">
        <div
          className={`${
            theme.footer.container
          } d-flex align-items-center justify-content-between`}
        >
          {Array.isArray(footerWidgets) ? (
            footerWidgets.map((Widget, index) => <Widget key={index} />)
          ) : (
            <FooterWidget />
          )}
          {CustomChildren && <CustomChildren />}
          <div
            className="col-2 order-last text-truncate d-none d-md-block d-lg-block"
            style={{ textAlign: 'right' }}
          >
            {!hideFooterAttribution && (
              <Text>
                Powered by <Link to="https://bpanel.org">bPanel</Link>
              </Text>
            )}
          </div>
        </div>
      </footer>
    );
  }
}

export default connectTheme(Footer);
