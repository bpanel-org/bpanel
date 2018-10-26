import { getClient } from '@bpanel/bpanel-utils';

export function errorCatcherMiddleware(errorHandler) {
  return function(store) {
    return function(next) {
      return function(action) {
        try {
          return next(action);
        } catch (err) {
          const message = `There was an error in the middleware for the action ${
            action.type
          }: `;
          errorHandler(message, err, store.getState, action, store.dispatch);
          return err;
        }
      };
    };
  };
}

export function clientMiddleware() {
  return function(next) {
    return function(action) {
      const client = getClient();
      if (action.type === 'SET_CURRENT_CLIENT') {
        const clientInfo = action.payload;

        if (!clientInfo.chain && clientInfo.id)
          // eslint-disable-next-line no-console
          console.warn(
            `No chain was set for client ${
              clientInfo.id
            }, defaulting to "bitcoin"`
          );
        const { id, chain = 'bitcoin' } = clientInfo;
        // set the client info for the global client
        if (id) client.setClientInfo(id, chain);
      }
      return next(action);
    };
  };
}
