import { SOCKET_CONNECTED, ADD_NEW_BLOCK } from './constants';
import { watchChain, subscribeBlockConnect, setChainTip } from './actions';

export const metadata = {
  name: 'chainSockets',
  author: 'bcoin-org'
};

export const addSocketConstants = (sockets = { listeners: [] }) => {
  sockets.listeners.push({
    event: 'new block',
    actionType: ADD_NEW_BLOCK
  });
  return Object.assign(sockets, {
    socketListeners: sockets.listeners
  });
};

// custom middleware for our plugin. This gets
// added to the list of middlewares in the app's store creator
export const middleware = ({ dispatch, getState }) => next => async action => {
  const { type, payload } = action;
  const chainState = getState().chain;

  if (type === SOCKET_CONNECTED) {
    // actions to dispatch when the socket has connected
    // these are broadcasts and subscriptions we want to make
    // to the bcoin node
    dispatch(watchChain());
    dispatch(subscribeBlockConnect());
  } else if (type === ADD_NEW_BLOCK && chainState.genesis) {
    dispatch(setChainTip(...payload));
  }
  next(action);
};
