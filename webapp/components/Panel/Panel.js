import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      customChildren: PropTypes.array
    };
  }
  render() {
    const { customChildren = [] } = this.props;
    const plugins = customChildren.map(({ name, Component }) => (
      <Route
        exact
        path={`/${name}`}
        key={`nav-${name}`}
        component={Component}
      />
    ));

    return <div className="col-8">{plugins}</div>;
  }
}
