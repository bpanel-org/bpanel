// utilities for plugins to load, cache, and decorate
import React from 'react';
import PropTypes from 'prop-types';
import { connect as reduxConnect } from 'react-redux';

import config from '../appConfig';

// Instantiate caches
let plugins;
let connectors;
let metadata = {};
// reducers
// middleware (action creators)
// decorated components
let decorated = {};

let routePropsDecorators;
let propsDecorators = {};

let chainReducers;
let reducersDecorators = {};

// Module/plugin loader
export const loadPlugins = () => {
  // initialize cache that we populate with extension methods
  connectors = {
    App: { state: [], dispatch: [] },
    Panel: { state: [], dispatch: [] }
  };

  // setup props decorators
  routePropsDecorators = [];
  propsDecorators = {
    getRouteProps: routePropsDecorators
  };

  // setup reducers decorators
  chainReducers = [];
  reducersDecorators = {
    chainReducer: chainReducers
  };

  // Loop/map through local (and later 'remote') plugins
  // load each plugin object into the the cache of modules
  plugins = config.localPlugins
    .map(pluginName => {
      const plugin = require('../localPlugins/' + pluginName);
      const { name, pluginVersion } = plugin.metadata;

      for (const method in plugin) {
        if ({}.hasOwnProperty.call(plugin, method)) {
          plugin[method]._pluginName = pluginName;
          plugin[method]._pluginVersion = pluginVersion;
        }
      }

      if (plugin.metadata && !metadata[name]) {
        // if there is metadata and the plugin doesn't already exist in the metadata object
        // store new metadata
        metadata[name] = plugin.metadata;
      } else {
        throw new Error(
          `${pluginName} didn't have any metadata or plugin name is duplicate`
        );
      }

      // state mappers
      if (plugin.mapPanelState) {
        connectors.Panel.state.push(plugin.mapPanelState);
      }

      if (plugin.mapAppState) {
        connectors.App.state.push(plugin.mapAppState);
      }

      if (plugin.mapPanelDispatch) {
        connectors.Panel.dispatch.push(plugin.mapPanelDispatch);
      }

      // propsDecorators
      if (plugin.getRouteProps) {
        routePropsDecorators.push(plugin.getRouteProps);
      }

      // reducersDecorators
      if (plugin.reduceChain) {
        reducersDecorators.chainReducer.push(plugin.reduceChain);
      }

      return plugin;
    })
    .filter(plugin => Boolean(plugin));
};

loadPlugins();

// using the decorator of the name `name` from the plugins
// this will reduce to a final state of props to pass down
// to the given child component
// `parentProps` is used by the plugin to pull out what props it needs
// then through the decorator adds those props to the final props object
// that will get passed to the child component
const getProps = (name, parentProps, props = {}, ...fnArgs) =>
  propsDecorators[name].reduce((acc, decorator) => {
    let props_;
    try {
      props_ = decorator(parentProps, acc, ...fnArgs);
    } catch (err) {
      //eslint-disable-next-line no-console
      console.log(
        'Plugin error',
        `${decorator._pluginName}: Error occurred in \`${name}\``,
        err.stack
      );
      return;
    }

    if (!props_ || typeof props_ !== 'object') {
      // eslint-disable-next-line no-console
      console.log(
        'Plugin error',
        `${decorator._pluginName}: Invalid return value of \`${name}\` (object expected).`
      );
      return;
    }
    return props_;
  }, Object.assign({}, props));

export function getRouteProps(parentProps, props) {
  return getProps('getRouteProps', parentProps, props);
}

// export middleware

// decorate and export reducers

export const decorateReducer = (reducer, name) => (state, action) =>
  reducersDecorators[name].reduce((state_, reducer_) => {
    return reducer_(state_, action);
  }, Object.assign({}, reducer(state, action)));

// connects + decorates a class
// plugins can override mapToState, dispatchToProps
// and the class gets decorated (proxied)
// Code based off of hyper.is
// https://github.com/zeit/hyper
export function connect(
  stateFn = () => ({}),
  dispatchFn = () => ({}),
  mergeProps = null,
  options = {}
) {
  return (Class, name) => {
    return reduxConnect(
      // reducing down to final state using the state mappers from plugins
      // initial state ispassed to connector from container component
      state =>
        connectors[name].state.reduce((acc, mapper) => {
          let ret = acc;
          try {
            ret = mapper(state, acc);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log(
              `Plugin error: Problem with \`map${name}State\` for ${mapper._pluginName}: `,
              err.stack
            );
          }
          if (!ret || typeof ret !== 'object') {
            // eslint-disable-next-line no-console
            console.log(
              'Plugin error ',
              `${mapper._pluginName}: Invalid return value of \`map${name}State\` (object expected).`
            );
            return;
          }
          return ret;
        }, stateFn(state)),
      dispatch =>
        connectors[name].dispatch.reduce((acc, mapper) => {
          let ret = acc;
          try {
            ret = mapper(dispatch, acc);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log(
              `Plugin error: Problem with \`map${name}State\` for ${mapper._pluginName}: `,
              err.stack
            );
          }
          if (!ret || typeof ret !== 'object') {
            // eslint-disable-next-line no-console
            console.log(
              'Plugin error ',
              `${mapper._pluginName}: Invalid return value of \`map${name}State\` (object expected).`
            );
            return;
          }

          return ret;
        }, dispatchFn(dispatch)),
      mergeProps,
      options
    )(decorate(Class, name));
    // )(Class);
  };
}

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
function decorate(Component_, name) {
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

export default {
  initialMetadata,
  decorate,
  connect,
  decorateReducer
};
