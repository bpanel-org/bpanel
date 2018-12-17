const Config = require('bcfg');
const assert = require('bsert');
const bcurl = require('bcurl');

const { configHelpers, clientFactory } = require('../utils');
const { getDefaultConfig, testConfigOptions, getConfig } = configHelpers;

// utility to return basic info about a client based on its config
function getClientInfo(config, clientHealth) {
  assert(config instanceof Config, 'Must pass a bcfg Config object');
  const info = {
    id: config.str('id'),
    chain: config.str('chain', 'bitcoin'),
    services: {
      node: config.bool('node', true),
      wallet: config.bool('wallet', true),
      multisig: config.bool('multisig', true)
    }
  };
  if (clientHealth) {
    const node = clientHealth.errors ? !clientHealth.errors.node : true;
    const wallet = clientHealth.errors ? !clientHealth.errors.wallet : true;
    const multisig = clientHealth.errors ? !clientHealth.errors.multisig : true;
    info.services = {
      node: config.bool('node', node),
      wallet: config.bool('wallet', wallet),
      multisig: config.bool('multisig', multisig)
    };
  }

  return info;
}

function getClientsInfo(req, res) {
  const { logger, clients } = req;
  const clientInfo = {};

  for (let [, client] of clients) {
    if (!client.str('chain'))
      logger.warning(
        `Client config ${client.str(
          'id'
        )} had no chain set, defaulting to 'bitcoin'`
      );
    clientInfo[client.str('id')] = getClientInfo(client, req.clientHealth);
  }

  return res.status(200).json(clientInfo);
}

function getDefaultClientInfo(req, res, next) {
  const { config } = req;
  let defaultClientConfig;
  try {
    defaultClientConfig = getDefaultConfig(config);
    const defaultClient = getClientInfo(defaultClientConfig, req.clientHealth);
    return res.status(200).json(defaultClient);
  } catch (e) {
    if (!defaultClientConfig || !config)
      return res.status(404).json({
        error: {
          message: `Sorry, there was no default client available`,
          code: 404
        }
      });
    next(e);
  }
}

async function clientsHandler(req, res) {
  let token;
  const { method, path, body, query, params, logger, clients } = req;
  const { id } = params;

  if (!clients.has(id))
    return res.status(404).json({
      error: {
        message: `Sorry, there was no client with the id ${id}`,
        code: 404
      }
    });

  const config = clients.get(id);

  assert(config instanceof Config, 'client needs bcfg config');

  const { nodeClient, walletClient, multisigClient } = clientFactory(config);

  const reqClients = {
    node: nodeClient,
    wallet: walletClient,
    multisig: multisigClient
  };

  const client = reqClients[params.client];

  if (!client)
    return res.status(404).json({
      error: {
        message: `Requested client ${params.client} for ${id} does not exist`,
        code: 404
      }
    });

  /*
   * this part of the handler is the proxy to the nodes that the clients
   * are communicating with
   */

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
}

// a middleware to check the health of requested client
// only operates if has query param `health` set to true
// attaches `clientHealth` to req object
async function testClientsHandler(req, res, next) {
  const { logger, query, params, body } = req;
  if ((query && query.health) || (body && body.health)) {
    const { id } = params;
    const { options } = req.body;
    let configOptions = { id };

    if (options) configOptions = { ...configOptions, ...options };

    // get original configs to merge any missing items if updating
    try {
      const { data } = getConfig(id);
      configOptions = { ...data, ...configOptions };
    } catch (e) {
      // if missing config, can disregard
      if (e.code === 'ENOENT')
        logger.debug('No existing config with id: %s', id);
      else next(e);
    }

    const clientHealth = {};

    try {
      logger.info('Checking health of client "%s"...', id);
      const [err, clientErrors] = await testConfigOptions(configOptions);
      if (!err) {
        clientHealth.healthy = true;
        logger.info('Client "%s" is healthy', id);
      } else {
        clientHealth.failed = clientErrors.failed;
        clientHealth.errors = clientErrors;
        clientHealth.healthy = false;
        logger.warning('Problem checking configs for client "%s": ', id);
        logger.warning(clientErrors.message);
      }
      // attach clientHealth to request object
      req.clientHealth = clientHealth;
    } catch (e) {
      return next(e);
    }
  }
  next();
}

async function getConfigHandler(req, res) {
  const { logger, clientHealth } = req;
  let config;
  try {
    config = await getConfig(req.params.id);
  } catch (e) {
    logger.error(e);
    if (e.code === 'ENOENT')
      return res.status(404).json({
        error: {
          message: `Config for '${req.params.id}' not found`,
          code: 404
        }
      });
    else
      return res.status(500).json({
        error: {
          message: `There was a problem with your request.`,
          code: 500
        }
      });
  }

  const clientInfo = getClientInfo(config, req);
  let info = {
    ...clientInfo,
    configs: config.data
  };

  if (req.clientHealth) {
    info = { ...info, ...clientHealth };
  }

  // scrub apiKeys and tokens
  for (let key in config.data) {
    if (key.includes('api') || key.includes('token'))
      config.data[key] = undefined;
  }

  return res.status(200).json(info);
}

async function curl(req, res) {
  const { logger, params } = req;
  const url = params.host + '/' + params.path;
  try {
    logger.info('Fetching json from ' + url);
    const client = bcurl.client(params.host);
    const json = await client.get(params.path);
    return res.status(200).json(json);
  } catch (e) {
    logger.warning(e);
    return res.status(500).json({
      error: {
        messgae: `There was a problem fetching ${url}`,
        code: 500
      }
    });
  }
}

module.exports = {
  clientsHandler,
  getClientsInfo,
  getConfigHandler,
  getDefaultClientInfo,
  testClientsHandler,
  curl
};
