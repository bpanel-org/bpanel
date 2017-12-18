import Dashboard from './Dashboard';
import { SET_RECENT_BLOCKS } from './constants';

// eslint-disable-next-line import/no-unresolved
import { chain as chainUtils } from 'bpanel/utils';

export const metadata = {
  name: 'dashboard',
  author: 'bcoin-org',
  order: 0,
  icon: 'home',
  parent: ''
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
    default:
      return newState;
  }
};

// action creator to set recent blocks on state
// mapped to the state via `mapPanelDispatch` below
// this allows plugins to call action creator to update the state
const getRecentBlocks = (n = 9) => (dispatch, getState) => {
  const { getBlocksInRange } = chainUtils;
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
        customChildren: PropTypes.array,
        chainHeight: PropTypes.number,
        getRecentBlocks: PropTypes.func
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
