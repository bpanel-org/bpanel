import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getRouteProps } from '../plugins/plugins';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    const { customChildren = [], paths } = props;
    this.routes = customChildren.map(({ Component, metadata }) => {
      const { name } = metadata;

      const pathName = paths[name]; // will be a unique path from state
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
            path={`/${path}`}
            key={`nav-${name}`}
            render={pathProps => this.childRoute(Component, name, pathProps)} // using render so we can pass props
          />
        );
      } catch (e) {}
    });
  }

  static get displayName() {
    return 'Panel';
  }

  static get propTypes() {
    return {
      customChildren: PropTypes.array,
      paths: PropTypes.shape({
        name: PropTypes.string,
        pathName: PropTypes.string
      })
    };
  }

  // a method to create the routes
  // returns the view Component with props
  childRoute(Component, name = '', pathProps) {
    // get props needed for each route
    // 'name' should correspond with the plugin name for each route
    const routeProps = getRouteProps(name, this.props);

    return <Component {...routeProps} {...pathProps} />;
  }

  render() {
    return (
      <div>
        <Switch>{this.routes}</Switch>
      </div>
    );
  }
}
