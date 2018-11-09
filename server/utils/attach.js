const methods = require('../endpoints/methods');
const { GET, POST, PUT, DELETE, USE } = methods;

function attach(app, endpoint) {
  const { method, path, handler } = endpoint;
  switch (method) {
    case USE:
      app.use(path, handler);
      break;
    case GET:
      app.get(path, handler);
      break;
    case POST:
      app.post(path, handler);
      break;
    case PUT:
      app.put(path, handler);
      break;
    case DELETE:
      app.delete(path, handler);
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
