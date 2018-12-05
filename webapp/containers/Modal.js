import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@bpanel/bpanel-ui';

import { initialModals } from '../plugins/plugins';
const { connectTheme } = utils;

// cached modals from initial build
// of all plugins
const MODALS = initialModals();

class Modal extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get defaultProps() {
    return {
      data: {},
      plugin: undefined,
      theme: {},
      show: false
    };
  }

  render() {
    const { children, show, plugin, data, theme } = this.props;
    const Element = MODALS[plugin];

    let className = `${theme.modal.container}`;
    if (!show) className += ` ${theme.modal.hidden}`;

    return (
      <div>
        <div className={className}>
          <Element {...this.props} {...data} />
        </div>
        {children}
      </div>
    );
  }
}

export default connectTheme(Modal);
