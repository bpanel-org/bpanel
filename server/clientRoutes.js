const express = require('express');
const assert = require('bsert');
const Config = require('bcfg');

const logger = require('./logger');
const {
  createClientConfig,
  getConfig,
  deleteConfig,
  testConfigOptions
} = require('./configHelpers');

function clientsRouter(clients, defaultId) {
  const router = express.Router({ mergeParams: true });
  let token, id, config, reqClients;

  // return object with
  // relevant info for each client
  // keyed to the client id
  const clientInfo = {};

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
  router.get('/:id', async (req, res) => {
    let configurations;
    try {
      configurations = await getConfig(req.params.id);
    } catch (e) {
      logger.error(e);
      if (e.code === 'ENOENT')
        return res.status(404).send(`Config for "${req.params.id}" not found`);
      else
        return res.status(500).send(`There was a problem with your request.`);
    }

    const info = {
      configs: configurations.data
    };

    if (req.query.checkStatus) {
      logger.info(`Checking status of client "${req.params.id}"...`);
      try {
        await testConfigOptions(configurations);
        info.status = true;
      } catch (e) {
        if (e.failed && e.failed.length) {
          info.failed = e.failed;
          info.status = false;
        } else {
          return res.status(500).send(e);
        }
      }
    }

    // scrub apiKeys and tokens
    for (let key in configurations.data) {
      if (key.includes('api') || key.includes('token'))
        delete configurations.data[key];
    }

    res.status(200).json(info);
  });

  router.post('/:id', async (req, res) => {
    const id = req.params.id;
    if (clientInfo[id])
      return res
        .status(409)
        .send({ message: `A client with the id '${id}' already exists` });

    return updateOrAdd(req, res);
  });

  router.delete('/:id', (req, res) => {
    const success = deleteConfig(req.params.id);
    return res.status(200).json({ success });
  });

  router.put('/:id', updateOrAdd);
  return router;
}

async function updateOrAdd(req, res) {
  const id = req.params.id;
  try {
    const { options, force = false } = req.body;
    const config = await createClientConfig(id, options, force);
    return res.status(200).send({
      configs: config.options
    });
  } catch (error) {
    logger.error('Problem creating config: ', error.message);
    return res
      .status(400)
      .send({ error: { message: error.message, ...error } });
  }
}

module.exports = clientsRouter;
