const {
  getClientsInfo,
  getDefaultClientInfo,
  clientsHandler,
  getConfigHandler,
  addConfigHandler,
  updateConfigHandler,
  deleteConfigHandler
} = require('../handlers/clients');

const { GET, POST, PUT, DELETE, USE } = require('./methods');

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
    method: GET,
    path: base.concat('/:id'),
    handler: getConfigHandler
  },
  {
    method: POST,
    path: base.concat('/:id'),
    handler: addConfigHandler
  },
  {
    method: PUT,
    path: base.concat('/:id'),
    handler: updateConfigHandler
  },
  {
    method: DELETE,
    path: base.concat('/:id'),
    handler: deleteConfigHandler
  }
];
