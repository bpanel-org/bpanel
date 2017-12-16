import Dashboard from './Dashboard';
import { SET_RECENT_BLOCKS } from './constants';

// eslint-disable-next-line import/no-unresolved
import { chain } from 'Utilities';

export const metadata = {
  name: 'dashboard',
  author: 'bcoin-org',
  order: 0,
  icon: 'home',
  parent: ''
};

export const reduceChain = (state, action) => {
  const { type, payload } = action;
  let newState = { ...state };

  switch (type) {
    case SET_RECENT_BLOCKS: {
      newState.recentBlocks = payload;
      return newState;
    }
    default:
      return newState;
  }
};

// action creator to set recent blocks on state
const getRecentBlocks = (n = 9) => (dispatch, getState) => {
  const { getBlocksInRange } = chain;
  const { height } = getState().chain;
  getBlocksInRange(height - n).then(blocks =>
    dispatch({
      type: SET_RECENT_BLOCKS,
      payload: blocks
    })
  );
};

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
export const getRouteProps = (parentProps, props) =>
  Object.assign(props, {
    chainHeight: parentProps.chainHeight,
    recentBlocks: parentProps.recentBlocks,
    getRecentBlocks: parentProps.getRecentBlocks
  });

// a decorator for the Panel container component in our app
export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class DecoratedDashboard extends React.Component {
    static displayName() {
      return 'bPanel Dashboard';
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array,
        chainHeight: PropTypes.number,
        getRecentBlocks: PropTypes.func
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const pluginData = {
        name: metadata.name,
        Component: Dashboard,
        props: ['chainHeight', 'getRecentBlocks', 'recentBlocks']
      };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(pluginData)}
        />
      );
    }
  };
};

// TODO:
// - support for adding/mapping new dispatches ()
// - Get most recent n number of blocks (x)
// - Update when a new block comes in (need to add to listeners?) ()

// GET_BLOCKS
// We have access to the chain height already
// -- Plugin needs to tell bPanel to get a number of blocks - dispatch(getRecentBlocks(nBlocks))
// -- Need to pass that dispatch down to plugin component via mapPanelDispatch (for connect)
// -- Plugin needs to tell bPanel to pass those blocks down
// -- Plugin should extend chain state to add recentBlocks

// QUESTIONS
// Where do we want to keep the block data? Should this be plugin specific?
// i.e. does the plugin just retrieve recent blocks from state
// or does it extend the reducers to add "recent blocks" to the state?
// Probably the latter.
