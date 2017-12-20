import { chainentry } from 'bcoin';
// eslint-disable-next-line import/no-unresolved
import { chain as chainUtils } from 'bpanel/utils';

import Dashboard from './Dashboard';
import {
  SET_RECENT_BLOCKS,
  ADD_RECENT_BLOCK,
  SET_CHAIN_TIP
} from './constants';

export const metadata = {
  name: 'dashboard',
  author: 'bcoin-org',
  order: 0,
  icon: 'home',
  parent: ''
};

// this decorator lets us add to the app constants
// in this case we want to add to the array of listeners
// in the sockets constants
// currently this doesn't do anything
// as the server is no longer firing 'new block'
// but leaving it here as an example
export const addSocketsConstants = (sockets = {}) =>
  Object.assign(sockets, {
    socketListeners: sockets.listeners.push({
      event: 'new block',
      actionType: ADD_RECENT_BLOCK,
      numBlocks: 9
    })
  });

// custom middleware for our plugin. This gets
// added to the list of middlewares in the app's
// store creator
export const middleware = ({ dispatch, getState }) => next => action => {
  const { type, payload } = action;
  const currentProgress = getState().chain.progress;
  const recentBlocks = getState().chain.recentBlocks;
  // if dispatched action is SET_CHAIN_TIP,
  // chain is fully synced (progress=1),
  // and recent blocks are already loaded
  // this middleware will intercept and run ADD_RECENT_BLOCK instead
  if (type === SET_CHAIN_TIP && currentProgress === 1 && recentBlocks.length) {
    dispatch({
      type: ADD_RECENT_BLOCK,
      payload: { ...payload, numBlocks: 9 }
    });
  } else {
    next(action);
  }
};

// custom reducer used to decorate the main app's chain reducer
export const reduceChain = (state, action) => {
  const { type, payload } = action;
  let newState = { ...state };

  switch (type) {
    case SET_RECENT_BLOCKS: {
      newState.recentBlocks = payload;
      return newState;
    }

    case ADD_RECENT_BLOCK: {
      const { numBlocks, block, progress, tip, height } = payload;

      const entry = chainentry.fromRaw(block.entry);
      // skip if the height of new block is same as top block
      // or recentBlocks haven't been hydrated yet
      // reason is new block can be received multiple times
      if (
        newState.recentBlocks &&
        newState.recentBlocks.length &&
        entry.height !== newState.recentBlocks[0].height
      ) {
        // update chain tip info
        newState.progress = progress;
        newState.height = height;
        newState.tip = tip;

        // add new block
        newState.recentBlocks.unshift(entry);

        // check if action includes a length to limit recent blocks list to
        if (numBlocks && newState.recentBlocks.length >= numBlocks) {
          newState.recentBlocks.pop();
        }
      }
      return newState;
    }

    default:
      return newState;
  }
};

// action creator to set recent blocks on state
// mapped to the state via `mapPanelDispatch` below
// this allows plugins to call action creator to update the state
function getRecentBlocks(n = 9) {
  return async (dispatch, getState) => {
    const { getBlocksInRange } = chainUtils;
    const { height } = getState().chain;

    const blocks = await getBlocksInRange(height, height - n, -1);
    dispatch({
      type: SET_RECENT_BLOCKS,
      payload: blocks
    });
  };
}

// mapping dispatches to panel component props
// used by the app's custom react-redux connect
export const mapPanelDispatch = (dispatch, map) =>
  Object.assign(map, {
    getRecentBlocks: (n = 9) => dispatch(getRecentBlocks(n))
  });

// Tells decorator what our plugin needs from the state
// This is available for container components that use an
// extended version of react-redux's connect to connect
// a container to the state and retrieve props
export const mapPanelState = (state, map) =>
  Object.assign(map, {
    chainHeight: state.chain.height,
    recentBlocks: state.chain.recentBlocks ? state.chain.recentBlocks : []
  });

// mapPanelState will use react-redux's connect to
// retrieve chainHeight from the state, but we need a way
// for the Panel Container to pass it down to the Dashboard Route view
// props getters like this are used in the app to pass new props
// added by plugins down to children components (such as the Dashboard)
export const getRouteProps = (parentProps, props) =>
  Object.assign(props, {
    chainHeight: parentProps.chainHeight,
    recentBlocks: parentProps.recentBlocks,
    getRecentBlocks: parentProps.getRecentBlocks
  });

// a decorator for the Panel container component in our app
// here we're extending the Panel's children by adding
// our plugin's component, the Dasboard in this case
export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class DecoratedDashboard extends React.Component {
    static displayName() {
      return 'bPanel Dashboard';
    }

    static get propTypes() {
      return {
        chainHeight: PropTypes.number,
        customChildren: PropTypes.array,
        getRecentBlocks: PropTypes.func,
        recentBlocks: PropTypes.array
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const routeData = {
        name: metadata.name,
        Component: Dashboard,
        props: ['chainHeight', 'getRecentBlocks', 'recentBlocks']
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
