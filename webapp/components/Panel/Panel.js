import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getRouteProps } from '../../plugins/plugins';

class Panel extends React.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      customChildren: PropTypes.array
    };
  }

  // a method to create the routes
  // it returns the view Component with props
  childRoute(Component, _routeProps = []) {
    // first decorate the container's props with those from plugins
    const props = getRouteProps(this.props);

    // next get props that only this route needs
    // the _routeProps arg is passed by the plugin to say which props it needs
    const routeProps = {};

    if (_routeProps.length) {
      for (const prop in props) {
        if (_routeProps.indexOf(prop) > -1) {
          routeProps[prop] = props[prop];
        }
      }
    }

    return <Component {...routeProps} />;
  }

  render() {
    const { customChildren = [] } = this.props;
    const routes = customChildren.map(({ name, Component, props }) => (
      <Route
        exact
        path={`/${name}`}
        key={`nav-${name}`}
        render={() => this.childRoute(Component, props)} // using render so we can pass props
      />
    ));

    return <div className="col-8">{routes}</div>;
  }
}

export default Panel;
