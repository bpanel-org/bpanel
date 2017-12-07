import React from 'react';
import { Route } from 'react-router-dom';
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
    const { customChildren = [] } = this.props;
    const plugins = customChildren.map(pluginData => (
      <Route
        exact
        path={'/' + pluginData.name}
        component={pluginData.Component}
      />
    ));

    return <div className="col-8">{plugins}</div>;
  }
}
