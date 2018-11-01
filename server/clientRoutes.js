const express = require('express');
const assert = require('bsert');
const Config = require('bcfg');
const logger = require('./logger');
const { createClientConfig } = require('./configCreator');

function clientsRouter(clients, defaultId) {
  const router = express.Router({ mergeParams: true });
  let token, id, config, reqClients;

  // return object with
  // relevant info for each client
  // keyed to the client id
  const clientInfo = {};
  console.log('clientRoutes:', clients.get('hsd_local').walletClient);
  clients.forEach((client, id) => {
    if (!client.config.str('chain'))
      logger.warn(
        `Client config ${id} had no chain set, defaulting to 'bitcoin'`
      );
    clientInfo[client.config.str('id')] = {
      chain: client.config.str('chain', 'bitcoin'),
      services: {
        node: !!client.nodeClient,
        wallet: !!client.walletClient,
        multisig: !!client.multisigWalletClient
      }
    };
  });
  router.get('/', (req, res) => res.status(200).json(clientInfo));
  router.get('/default', (req, res) => {
    if (!clients.has(defaultId))
      return res.status(500).json({
        error: {
          message: `Error retrieving default client: ${defaultId}`,
          code: 500
        }
      });

    const defaultClient = {
      id: defaultId,
      ...clientInfo[defaultId]
    };
    res.status(200).json(defaultClient);
  });

  // middleware for setting constants based on
  // the route being used
  router.use('/:id', (req, res, next) => {
    // this middleware only useful for existing clients
    // so we can skip if POSTing a new client config
    if (req.method === 'POST') return next();

    id = req.params.id;
    if (!clients.has(id))
      return res.status(404).json({
        error: {
          message: `Sorry, there was no client with the id ${id}`,
          code: 404
        }
      });

    const clientObj = clients.get(id);
    config = clientObj.config;
    assert(config instanceof Config, 'client needs bcfg config');

    // store clients to be used in the routes
    // handled in the next middleware
    reqClients = {
      node: clientObj.nodeClient,
      wallet: clientObj.walletClient,
      multisig: clientObj.multisigWalletClient
    };
    next();
  });

  // all routes for a given client
  // the client param dictates client, node,
  // wallet, or multisig, will be used
  router.use('/:id/:client/', async (req, res) => {
    const { method, path, body, query, params } = req;
    const client = reqClients[params.client];
    if (!client)
      return res.status(404).json({
        error: {
          message: `Requested client ${params.client} for ${id} does not exist`,
          code: 404
        }
      });

    // use query params for GET request, otherwise use body
    const payload = method === 'GET' ? query : body;
    try {
      logger.debug(
        `client: ${client.constructor.name}, method: ${method},`,
        `path: ${path}`
      );
      logger.debug('query:', query);
      logger.debug('body:', body);

      // proxy the token
      token = client.token;
      if ('token' in payload) {
        client.token = payload.token;
        logger.debug('Using custom client token');
      }
      const response = await client.request(method, path, payload);
      logger.debug('server response:', response ? response : 'null');
      if (response) return res.status(200).json(response);
      // return 404 when response is null due to
      // resource not being found on server
      return res.status(404).json({ error: { message: 'resource not found' } });
    } catch (e) {
      logger.error(`Error querying ${client.constructor.name}:`, e);
      return res
        .status(502)
        .send({ error: { message: e.message, code: e.code, type: e.type } });
    } finally {
      // always reassign the original token
      client.token = token;
    }
  });

  // get info about a specific client
  router.get('/:id', (req, res) => {
    const info = {
      network: config.str('network'),
      chain: config.str('chain', 'bitcoin')
    };
    res.status(200).json(info);
  });

  router.post('/:id', async (req, res) => {
    const id = req.params.id;
    if (clientInfo[req.params.id])
      return res
        .status(409)
        .send({ message: `A client with the id "${id}" already exists` });

    try {
      const config = await createClientConfig({ id, ...req.body });
      res.status(200).json({
        message: 'so you want to add a client?',
        client: config.options
      });
    } catch (error) {
      logger.error('Problem creating config: ', error.message);
      res.status(400).send({ error: { message: error.message, ...error } });
    }
    // will check for some sort of option in body to "force"
    // creation. This is for the case where user confirms
    // they want to create a config when client fails to connect
  });

  router.delete('/:id', (req, res) => {
    res.status(200).json({
      message: 'so you want to delete a client?',
      client: clientInfo[req.params.id]
    });
  });

  router.put('/:id', (req, res) => {
    res.status(200).json({
      message: 'so you want to update a client?',
      client: clientInfo[req.params.id]
    });
  });
  return router;
}

module.exports = clientsRouter;
