const {
  clientsHandler,
  getClientsInfo,
  getDefaultClientInfo,
  getConfigHandler,
  testClientsHandler,
  curl
} = require('../handlers/clients');

const { GET, USE } = require('./methods');

const base = '/clients';

module.exports = [
  {
    method: GET,
    path: base.concat('/'),
    handler: getClientsInfo
  },
  {
    method: GET,
    path: base.concat('/default'),
    handler: getDefaultClientInfo
  },
  {
    method: USE,
    path: base.concat('/:id/:client'),
    handler: clientsHandler
  },
  {
    method: USE,
    path: base.concat('/:id'),
    handler: testClientsHandler
  },
  {
    method: GET,
    path: base.concat('/:id'),
    handler: getConfigHandler
  },
  {
    method: GET,
    path: '/curl/:host/:path',
    handler: curl
  }
];
