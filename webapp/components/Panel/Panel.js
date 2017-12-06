import React from 'react';
import PropTypes from 'prop-types';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      customChildren: PropTypes.node
    };
  }
  render() {
    const { customChildren } = this.props;

    return <div className="col-8">{customChildren}</div>;
  }
}
