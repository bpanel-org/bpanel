// utilities for plugins to load, cache, and decorate
import React from 'react';
import PropTypes from 'prop-types';
import { connect as reduxConnect } from 'react-redux';
import Immutable from 'seamless-immutable';
import path from 'path';

import { propsReducerCallback, loadConnectors } from './utils';
import constants from '../store/constants';

// Instantiate caches
let plugins = [];
let connectors;
let metadata = {};

// middleware (action creators)
let middlewares;

// decorated components
let decorated = {};
let pluginDecorators = {};

// props decorators (for passing props to children components)
let panelPropsDecorators;
let routePropsDecorators;
let themeDecorators = [];
let propsDecorators = {};

// reducers
let chainReducers;
let nodeReducers;
let walletsReducers;
let reducersDecorators = {};

// miscellaneous decorators
let extendConstants = {};

// Module/plugin loader
export const loadPlugins = async config => {
  // initialize cache that we populate with extension methods
  // connectors for plugins to connect to state and dispatch
  // used in `connect` method
  connectors = {
    App: { state: [], dispatch: [] }
  };

  // setup constant decorators
  extendConstants = {
    sockets: []
  };

  // setup props decorators
  panelPropsDecorators = [];
  routePropsDecorators = {};
  themeDecorators = [];
  propsDecorators = {
    getPanelProps: panelPropsDecorators
  };

  // setup reducers decorators
  // TODO: This needs to be generalized
  chainReducers = [];
  nodeReducers = [];
  walletsReducers = [];
  reducersDecorators = {
    chainReducer: chainReducers,
    nodeReducer: nodeReducers,
    walletsReducer: walletsReducers
  };

  middlewares = [];

  // Loop/map through local (and later 'remote') plugins
  // load each plugin object into the the cache of modules
  // in hyper the list of absolute paths are generated with a util function
  // ahead of time, then required. Could solve these issues
  plugins = await Promise.all(
    config.localPlugins
      .map(async pluginName => {
        let plugin;
        try {
          plugin = await import(`../localPlugins/${pluginName}`);
          console.log('got plugin: ', pluginName);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`There was a problem loading ${pluginName}: ${e}`);
          return;
        }

        let name, pluginVersion;

        try {
          name = plugin.metadata.name;
          pluginVersion = plugin.metadata.pluginVersion;
          metadata[pluginName] = plugin.metadata;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(
            `There was a problem loading the metadata for ${pluginName}`
          );
        }

        for (const method in plugin) {
          if (plugin.hasOwnProperty(method)) {
            plugin[method]._pluginName = name;
            plugin[method]._pluginVersion = pluginVersion;
          }
        }

        if (plugin.appConfig) {
          // recursively loading plugin dependencies from a plugins config export
          // await loadPlugins(plugin.appConfig);
        }

        if (plugin.middleware) {
          middlewares.push(plugin.middleware);
        }

        // state mappers
        if (plugin.mapAppState) {
          connectors.App.state.push(plugin.mapAppState);
        }

        if (plugin.mapAppDispatch) {
          connectors.App.dispatch.push(plugin.mapAppDispatch);
        }

        // catch all state and dispatch mappers
        loadConnectors(plugin, 'state', connectors);
        loadConnectors(plugin, 'dispatch', connectors);

        // propsDecorators
        // routePropsDecorators is an object with keys corresponding to route
        if (plugin.getRouteProps) {
          for (let key in plugin.getRouteProps) {
            // skip if is an internal property
            if (key[0] === '_') continue;
            // initialize array of decorators for route if none
            if (!routePropsDecorators[key]) routePropsDecorators[key] = [];

            routePropsDecorators[key].push(plugin.getRouteProps[key]);
          }
        }

        // TODO: will prob. want to clean this up w/ plugin system refactor
        // all prop-getting now happening in getRouteProps
        // which also looks closer to what
        // the generalized system may end up being
        if (plugin.getPanelProps) {
          panelPropsDecorators.push(plugin.getPanelProps);
        }

        // catchall props getter
        // key should match the component that will be getting props
        // and value (in the plugin) is a function that extends the props
        // these are collected in an array of functions mapped to component name
        if (plugin.getProps) {
          for (let key in plugin.getProps) {
            if (key[0] === '_') continue; // skip if is an internal property
            if (!propsDecorators[key]) propsDecorators[key] = [];
            propsDecorators[key] = plugin.getProps;
          }
        }

        // reducersDecorators
        if (plugin.reduceChain) {
          reducersDecorators.chainReducer.push(plugin.reduceChain);
        }

        if (plugin.reduceNode) {
          reducersDecorators.nodeReducer.push(plugin.reduceNode);
        }

        if (plugin.reduceWallets) {
          reducersDecorators.walletsReducer.push(plugin.reduceWallets);
        }

        // other miscellaneous decorators
        if (plugin.addSocketConstants) {
          extendConstants.sockets.push(plugin.addSocketConstants);
        }

        // themeDecorators
        if (plugin.decorateTheme) {
          themeDecorators.push(plugin.decorateTheme);
        }

        // for plugins that can be decorated by other plugins
        if (plugin.decoratePlugin) {
          // check for each plugin decorator
          for (let key in plugin.decoratePlugin) {
            if (key[0] === '_') continue; // skip if is an internal property
            // check if dependency plugin has been loaded
            if (!metadata[key]) {
              // eslint-disable-next-line no-console
              console.error(
                `Plugin dependency "${key}" does not exist for ${name}.`,
                `Please make sure plugin "${key}" has been added to configs`,
                `and is loaded before child plugin "${name}"`
              );
              return;
            }
            // initialize of plugin decorators if none
            if (!pluginDecorators[key]) pluginDecorators[key] = [];
            pluginDecorators[key].push(plugin.decoratePlugin[key]);
          }
        }

        return plugin;
      })
      .filter(plugin => Boolean(plugin))
  );
  return plugins;
};

export function getConstants(name) {
  return extendConstants[name].reduce(
    (acc, reducer) => reducer(acc),
    constants[name]
  );
}

// redux middleware generator
// Originally from hyper.is
export const pluginMiddleware = store => next => action => {
  const nextMiddleware = remaining => action_ =>
    remaining.length
      ? remaining[0](store)(nextMiddleware(remaining.slice(1)))(action_)
      : next(action_);
  nextMiddleware(middlewares)(action);
};

// using the decorator of the name `name` from the plugins
// this will reduce to a final state of props to pass down
// to the given child component
// `parentProps` is used by the plugin to pull out what props it needs
// then through the decorator adds those props to the final props object
// that will get passed to the child component
export const getProps = (name, parentProps, props = {}, ...fnArgs) =>
  !propsDecorators[name]
    ? parentProps // if no prop getter for component then return parent props
    : propsDecorators[name].reduce(
        propsReducerCallback(name, parentProps, ...fnArgs),
        Object.assign({}, props)
      );

export function getPanelProps(parentProps, props) {
  return getProps('getPanelProps', parentProps, props);
}

export const getRouteProps = (name, parentProps, props = {}, ...fnArgs) =>
  !routePropsDecorators[name]
    ? parentProps // if no prop getter for route then return parent props
    : routePropsDecorators[name].reduce(
        propsReducerCallback(name, parentProps, ...fnArgs),
        Object.assign({}, props)
      );

export const decorateTheme = themeCreator => {
  // Grab the latest theme decorator added to the theme decorator plugins list
  const latestThemeDecorator = themeDecorators[themeDecorators.length - 1];
  // Decorate default theme with the latest theme plugin
  if (latestThemeDecorator) return latestThemeDecorator(themeCreator)();
  return themeCreator();
};

// decorate and export reducers
export const decorateReducer = (reducer, name) => (state, action) =>
  reducersDecorators[name].reduce((state_, reducer_) => {
    return reducer_(state_, action);
  }, Immutable(reducer(state, action)));

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
      // initial state is passed to connector from container component
      state =>
        !connectors[name]
          ? stateFn(state) // return default if no connectors
          : connectors[name].state.reduce((acc, mapper) => {
              let ret = acc;
              try {
                // this is the decorator, everything after in this reduce is error checking
                ret = mapper(state, acc);
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error(
                  `Plugin error: Problem with \`map${name}State\` for ${mapper._pluginName}: `,
                  err.stack
                );
              }
              if (!ret || typeof ret !== 'object') {
                // eslint-disable-next-line no-console
                console.error(
                  'Plugin error ',
                  `${mapper._pluginName}: Invalid return value of \`map${name}State\` (object expected).`
                );
                return;
              }
              return ret;
            }, stateFn(state)), // initial state is from `mapStateToProps` from parent container
      dispatch =>
        !connectors[name]
          ? dispatchFn(dispatch) // return default if no connectors
          : connectors[name].dispatch.reduce((acc, mapper) => {
              let ret = acc;
              try {
                // this is the decorator, everything after in reduce is error checking
                ret = mapper(dispatch, acc);
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error(
                  `Plugin error: Problem with \`map${name}Dispatch\` for ${mapper._pluginName}: `,
                  err.stack
                );
              }
              if (!ret || typeof ret !== 'object') {
                // eslint-disable-next-line no-console
                console.error(
                  'Plugin error ',
                  `${mapper._pluginName}: Invalid return value of \`map${name}State\` (object expected).`
                );
                return;
              }

              return ret;
            }, dispatchFn(dispatch)), // initial state is from parent container
      mergeProps,
      options
    )(decorate(Class, name));
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
          console.error('Plugin error:', e);
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
      const decorator = plugin ? plugin[methodName] : '';

      if (decorator) {
        const pluginName = decorator._pluginName;
        let component__;
        try {
          // if has pluginDecorators
          if (pluginDecorators[pluginName]) {
            if (!plugin.decorator)
              throw "Parent plugin can't be decorated \
                    because it doesn't have decorator";
            // need to pass each to parent plugin's own decorator function
            pluginDecorators[pluginName].forEach(childDecorator =>
              plugin.decorator(childDecorator, { React, PropTypes })
            );
          }
          component__ = decorator(component_, { React, PropTypes });
          component__.displayName = `${pluginName}(${name})`;
        } catch (err) {
          //eslint-disable-next-line no-console
          console.error(
            `Plugin error when decorating component with ${pluginName}:`,
            typeof err === 'string' ? err : err.stack
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
      console.error(
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
