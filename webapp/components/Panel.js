import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getRouteProps } from '../plugins/plugins';

export default class extends Component {
  constructor(props) {
    super(props);
  }

  static get displayName() {
    return 'Panel';
  }

  static get propTypes() {
    return {
      customChildren: PropTypes.array
    };
  }

  // a method to create the routes
  // returns the view Component with props
  childRoute(Component, name = '') {
    // get props needed for each route
    // 'name' should correspond with the plugin name for each route
    const routeProps = getRouteProps(name, this.props);

    return <Component {...routeProps} />;
  }

  render() {
    const { customChildren = [] } = this.props;
    const routes = customChildren.map(({ Component, name, pathName }) => {
      let path;
      try {
        if (!name) throw 'Must pass a name for custom Panels';
        if (!pathName) {
          path = encodeURI(name);
        } else {
          path = encodeURI(pathName);
        }
        return (
          <Route
            exact
            path={`/${path}`}
            key={`nav-${name}`}
            render={() => this.childRoute(Component, name)} // using render so we can pass props
          />
        );
      } catch (e) {}
    });

    return <div>{routes}</div>;
  }
}
