const Config = require('bcfg');
const assert = require('bsert');

const { configHelpers, clientFactory } = require('../utils');
const {
  getDefaultConfig,
  createClientConfig,
  testConfigOptions,
  deleteConfig,
  getConfig,
  ClientErrors
} = configHelpers;

function getClientInfo(req, res) {
  const { logger, clients } = req;
  const clientInfo = {};

  clients.forEach(client => {
    if (!client.str('chain'))
      logger.warn(
        `Client config ${client.str(
          'id'
        )} had no chain set, defaulting to 'bitcoin'`
      );
    clientInfo[client.str('id')] = {
      chain: client.str('chain', 'bitcoin'),
      services: {
        node: client.bool('node', true),
        wallet: client.bool('wallet', true),
        multisig: client.bool('multisig', true)
      }
    };
  });

  return res.status(200).json(clientInfo);
}

function getDefaultClientInfo(req, res, next) {
  const { config, logger } = req;
  const defaultClientConfig = getDefaultConfig(config);

  // if there is no default config, return a 500
  if (!defaultClientConfig) {
    logger.error(`Request for default client failed: ${defaultId}`);
    return next(new Error('Request failed'));
  }

  const defaultId = defaultClientConfig.str('id');
  const defaultClient = {
    id: defaultId,
    chain: defaultClientConfig.str('chain', 'bitcoin'),
    services: {
      node: defaultClientConfig.bool('node', true),
      wallet: defaultClientConfig.bool('wallet', true),
      multisig: defaultClientConfig.bool('multisig', true)
    }
  };
  res.status(200).json(defaultClient);
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

  const { nodeClient, walletClient, multisigWalletClient } = clientFactory(
    config
  );

  const reqClients = {
    node: nodeClient,
    wallet: walletClient,
    multisig: multisigWalletClient
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

async function getConfigHandler(req, res) {
  const { logger } = req;
  let configurations;
  try {
    configurations = await getConfig(req.params.id);
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

  const info = {
    configs: configurations.data
  };

  if (req.query.health) {
    try {
      logger.info(`Checking status of client "${req.params.id}"...`);
      const [err, clientErrors] = await testConfigOptions(configurations);
      if (!err) info.healthy = true;
      else {
        info.failed = clientErrors.failed;
        info.healthy = false;
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  }

  // scrub apiKeys and tokens
  for (let key in configurations.data) {
    if (key.includes('api') || key.includes('token'))
      configurations.data[key] = undefined;
  }

  res.status(200).json(info);
}

function addConfigHandler(req, res) {
  const { clients } = req;
  const id = req.params.id;

  if (clients.get(id))
    return res.status(409).send({
      error: {
        message: `A client with the id '${id}' already exists`,
        code: 409
      }
    });

  req.type = 'add';
  return updateOrAdd(req, res);
}

function updateConfigHandler(req, res) {
  req.type = 'update';
  return updateOrAdd(req, res);
}

function deleteConfigHandler(req, res) {
  const error = deleteConfig(req.params.id);
  if (!error) return res.status(200).json({ success: true });
  else if (error.code === 'ENOENT')
    return res.status(404).json({
      error: { message: `Config for '${req.params.id}' not found` }
    });
  else throw error;
}

async function updateOrAdd(req, res) {
  const { logger } = req;
  const id = req.params.id;
  try {
    const { options, force = false } = req.body;

    // coercing force to a boolean
    let forceBool = force;
    if (forceBool === 'true' || forceBool === true) forceBool = true;
    else if (forceBool === 'false' || forceBool === false) forceBool = false;
    else logger.warn('Expected either "true" or "false" for the force option');

    let configOptions = options;
    // first get original configs to merge any missing items if updating
    // useful for fields like api key that are sent to client
    if (req.type === 'update') {
      const { data } = getConfig(id);
      configOptions = { ...data, ...configOptions };
    }

    for (let key in configOptions) {
      if (typeof configOptions[key] === 'string' && !configOptions[key].length)
        configOptions[key] = undefined;
    }

    const config = await createClientConfig(id, configOptions, forceBool);
    return res.status(200).send({
      configs: config.options
    });
  } catch (error) {
    logger.error('Problem creating config: ', error.message);
    // special error response with extra information
    // so want to still send 200 so client can receive full message
    // since bcurl sanitizes non-standard errors
    if (error instanceof ClientErrors)
      return res.status(200).send({ message: error.message, ...error });
    return res.status(400).send({ error: { message: error.message } });
  }
}

module.exports = {
  getClientInfo,
  getDefaultClientInfo,
  clientsHandler,
  getConfigHandler,
  addConfigHandler,
  updateConfigHandler,
  deleteConfigHandler
};
