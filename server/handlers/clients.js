const Config = require('bcfg');
const assert = require('bsert');

const { loadClientConfigs } = require('../loadConfigs');

const { configHelpers, clientFactory } = require('../utils');
const {
  getDefaultConfig,
  createClientConfig,
  createConfigsMap,
  testConfigOptions,
  deleteConfig,
  getConfig
} = configHelpers;

let configsMap = null;

function getClientInfo(logger, bpanelConfig) {
  return (req, res) => {
    const clientConfigs = loadClientConfigs(bpanelConfig);
    const clientInfo = {};

    for (let client of clientConfigs) {
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
    }

    return res.status(200).json(clientInfo);
  };
}

function getDefaultClientInfo(logger, bpanelConfig) {
  return (req, res) => {
    const defaultClientConfig = getDefaultConfig(bpanelConfig);

    // if there is no default config, return a 500
    if (!defaultClientConfig)
      return res.status(500).json({
        error: {
          message: `Error retrieving default client: ${defaultId}`,
          code: 500
        }
      });

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
  };
}

function clientsHandler(logger, bpanelConfig) {
  return async (req, res) => {
    let token;
    const { method, path, body, query, params } = req;
    const { id } = params;

    const clientConfigs = loadClientConfigs(bpanelConfig);

    if (!configsMap) configsMap = createConfigsMap(clientConfigs);

    if (!configsMap.has(id))
      return res.status(404).json({
        error: {
          message: `Sorry, there was no client with the id ${id}`,
          code: 404
        }
      });

    const config = configsMap.get(id);

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
  };
}

function getConfigHandler(logger) {
  return async (req, res) => {
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

    if (req.query.health) {
      try {
        logger.info(`Checking status of client "${req.params.id}"...`);
        const [err, clientErrors] = await testConfigOptions(configurations);
        if (!err) info.healthy = true;
        else if (clientErrors.failed.length) {
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
  };
}

function addConfigHandler(logger, bpanelConfig) {
  if (!configsMap) {
    const clientConfigs = loadClientConfigs(bpanelConfig);
    configsMap = createConfigsMap(clientConfigs);
  }
  return (req, res) => {
    const id = req.params.id;
    if (configsMap.get(id))
      return res
        .status(409)
        .send({ message: `A client with the id '${id}' already exists` });

    return updateOrAdd(logger, req, res);
  };
}

function updateConfigHandler(logger) {
  return (req, res) => updateOrAdd(logger, req, res);
}

function deleteConfigHandler() {
  return (req, res) => {
    const success = deleteConfig(req.params.id);
    return res.status(200).json({ success });
  };
}

async function updateOrAdd(logger, req, res) {
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

module.exports = {
  getClientInfo,
  getDefaultClientInfo,
  clientsHandler,
  getConfigHandler,
  addConfigHandler,
  updateConfigHandler,
  deleteConfigHandler
};