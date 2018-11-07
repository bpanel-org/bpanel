const methods = require('../endpoints/methods');
const { GET, POST, PUT, DELETE, USE } = methods;

function attach({ app, endpoint, logger, bpanelConfig }) {
  const { method, path, handler } = endpoint;
  switch (method) {
    case USE:
      app.use(path, handler(logger, bpanelConfig));
      break;
    case GET:
      app.get(path, handler(logger, bpanelConfig));
      break;
    case POST:
      app.post(path, handler(logger, bpanelConfig));
      break;
    case PUT:
      app.put(path, handler(logger, bpanelConfig));
      break;
    case DELETE:
      app.delete(path, handler(logger, bpanelConfig));
      break;
    default:
      throw new Error(
        `Unrecognized endpoint method ${endpoint.method} for path ${
          endpoint.path
        }`
      );
  }
}

module.exports = attach;
