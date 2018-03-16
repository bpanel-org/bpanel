import Immutable from 'seamless-immutable';

import Dashboard from './Dashboard';
import { addRecentBlock, getRecentBlocks } from './actions';
import {
  ADD_NEW_BLOCK,
  ADD_RECENT_BLOCK,
  SET_RECENT_BLOCKS
} from './constants';

// this component needs to be available to be decorated
// by children components. We're initializing it here
// then in the decorate method below we decorate it with the
// plugin decorators which are passed through on app load
let _DecoratedDashboard = Dashboard;

export const metadata = {
  name: 'dashboard',
  displayName: 'My Dashboard',
  pathName: 'dash',
  author: 'bcoin-org',
  order: 0,
  icon: 'home',
  sidebar: true, // set to true to show nav item in sidebar
  parent: ''
};

// custom middleware for our plugin. This gets
// added to the list of middlewares in the app's store creator
export const middleware = ({ dispatch, getState }) => next => action => {
  const { type, payload } = action;
  const { recentBlocks, progress } = getState().chain;
  if (
    type === ADD_NEW_BLOCK &&
    recentBlocks &&
    recentBlocks.length &&
    progress > 0.9
  ) {
    // if dispatched action is ADD_NEW_BLOCK,
    // and recent blocks are already loaded
    // this middleware will intercept and dispatch addRecentBlock
    dispatch(addRecentBlock(...payload));
  }
  return next(action);
};

// custom reducer used to decorate the main app's chain reducer
export const reduceChain = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_RECENT_BLOCKS: {
      if (payload.length)
        return state.set('recentBlocks', Immutable(payload), { deep: true });
      break;
    }

    case ADD_RECENT_BLOCK: {
      const block = payload;
      const numBlocks = 10;
      const blocks = state.getIn(['recentBlocks']);
      const newBlocks = [...blocks]; // get mutable version of blocks

      // skip if the height of new block is same as top block
      // or recentBlocks haven't been hydrated yet
      // reason is new block can be received multiple times
      if (blocks && blocks.length && block.height !== blocks[0].height) {
        newBlocks.unshift(block);

        // check if action includes a length to limit recent blocks list to
        if (numBlocks && state.recentBlocks.length >= numBlocks) {
          newBlocks.pop();
        }
      }

      return state.merge({
        recentBlocks: Immutable(newBlocks)
      });
    }

    default:
      return state;
  }
};

// mapping dispatches to panel component props
// used by the app's custom react-redux connect
export const mapComponentDispatch = {
  Panel: (dispatch, map) =>
    Object.assign(map, {
      getRecentBlocks: (n = 10) => dispatch(getRecentBlocks(n))
    })
};

// Tells the decorator what our plugin needs from the state
// This is available for container components that use an
// extended version of react-redux's connect to connect
// a container to the state and retrieve props
export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      chainHeight: state.chain.height,
      recentBlocks: state.chain.recentBlocks ? state.chain.recentBlocks : []
    })
};

// mapComponentDispatch will use react-redux's connect to
// retrieve chainHeight from the state, but we need a way
// for the Panel Container to pass it down to the Dashboard Route view
// props getters like this are used in the app to pass new props
// added by plugins down to children components (such as the Dashboard)
// The route Props getter is special since different routes will want diff props
// so we pass the getter as the value of an object prop, w/ the key
// corresponding to the route that needs the props
const dashboardProps = ['chainHeight', 'recentBlocks', 'getRecentBlocks'];
const passProps = (parentProps, props) => {
  // construct the propsObject from the list of dashboardProps
  const propsObject = dashboardProps.reduce(
    (acc, prop) =>
      Object.assign(acc, {
        [prop]: parentProps[prop]
      }),
    {}
  );
  return Object.assign(props, propsObject);
};

export const getRouteProps = { dashboard: passProps };

// special plugin decorator to allow other plugins to decorate this plugin
// the component is cached so that it is available for the main decorator below
// (`decoratePanel`) and cached component passed to pluginDecorator
export const decorator = (pluginDecorator, { React, PropTypes }) => {
  _DecoratedDashboard = pluginDecorator(_DecoratedDashboard, {
    React,
    PropTypes
  });
};

// a decorator for the Panel container component in our app
// here we're extending the Panel's children by adding
// our plugin's component, the Dasboard in this case
export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return 'bPanelDashboard';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const { name, pathName } = metadata;
      const routeData = {
        name,
        pathName,
        Component: _DecoratedDashboard
      };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(routeData)}
        />
      );
    }
  };
};
