import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class HeaderRow extends PureComponent {
  static get propTypes() {
    return {
      columns: PropTypes.node
    };
  }

  render() {
    const { columns, ...rest } = this.props;
    return (
      <div role="row" {...rest}>
        {columns}
      </div>
    );
  }
}
