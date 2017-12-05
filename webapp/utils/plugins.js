// utilities for plugins to load, cache, and decorate
import React from 'react';
import PropTypes from 'prop-types';

import config from '../appConfig';

// Instantiate caches
let plugins;
let metadata = new Map();
// reducers
// middleware (action creators)
// decorated components
let decorated = {};

// Module/plugin loader
export const loadPlugins = () => {
  // Loop/map through local (and later 'remote') plugins
  // load each plugin object into the the cache of modules
  plugins = config.localPlugins.map(pluginName => {
    const plugin = require('../localPlugins/' + pluginName);
    // cache each extension:
    // reducers
    // middleware
    const { name } = plugin.metadata;
    if (plugin.metadata && !metadata.has(name)) {
      // metadata.push(plugin.metadata);
      metadata.set(name, plugin.metadata);
    } else {
      throw new Error(
        `${pluginName} didn't have any metadata or plugin name is duplicate`
      );
    }

    return plugin;
  });
};

loadPlugins();

// export middleware

// export reducers

// expose decorated component instance to the higher-order components
// Code based off of hyper.is
// https://github.com/zeit/hyper
function exposeDecorated(Component_) {
  class DecoratedComponent extends React.Component {
    constructor(props, context) {
      super(props, context);
    }

    onRef(decorated_) {
      if (this.props.onDecorated) {
        try {
          this.props.onDecorated(decorated_);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Plugin error:', e);
        }
      }
    }
    render() {
      return React.createElement(
        Component_,
        Object.assign({}, this.props, { ref: () => this.onRef() })
      );
    }
  }

  DecoratedComponent.propTypes = {
    onDecorated: PropTypes.func
  };

  return DecoratedComponent;
}

// decorate target component with plugin HOCs
// based off of hyper.is getDecorated
// https://github.com/zeit/hyper
function getDecorated(Component, name) {
  // check if decorated component exists in the cache
  if (!decorated[name]) {
    let component_ = exposeDecorated(Component);
    component_.displayName = `exposeDecorated(${name})`;

    // if it doesn't, loop through all plugins and decorate the component class with appropriate method
    plugins.forEach(plugin => {
      const methodName = `decorate${name}`;
      const decorator = plugin[methodName];
      const pluginName = plugin.metadata.name;

      if (decorator) {
        let component__;
        try {
          component__ = decorator(component_, { React, PropTypes });
          component__.displayName = `${pluginName}(${name})`;
        } catch (err) {
          //eslint-disable-next-line no-console
          console.error(
            `Plugin error, ${pluginName} decorating component`,
            err.stack
          );

          return;
        }

        component_ = component__;
      }
    });
    decorated[name] = component_;
  }

  return decorated[name];
}

// for each component, we return a higher-order component
// that wraps with the higher-order components
// exposed by plugins
// Code based on hyper.is
// https://github.com/zeit/hyper

// This HOC handles error catching and returns fallback component if plugins error
export function decorate(Component_, name) {
  return class DecoratedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ hasError: true });
      // eslint-disable-next-line no-console
      console.log(
        `Plugins decorating ${name} has been disabled because of a plugin crash.`,
        error,
        errorInfo
      );
    }

    render() {
      const Sub = this.state.hasError
        ? Component_
        : getDecorated(Component_, name);
      return React.createElement(Sub, this.props);
    }
  };
}

export const initialMetadata = () => metadata;
