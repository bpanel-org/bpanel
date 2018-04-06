'use strict';

const express = require('express');
const logger = require('./logger');

const routerWithClient = client => {
  const bcoinRouter = express.Router({ mergeParams: true });

  bcoinRouter.all('*', async (req, res) => {
    const { method, path, body, query } = req;
    // use query params for GET request, otherwise use body
    const payload = method === 'GET' ? query : body;
    try {
      logger.debug(
        `client: ${client.constructor.name}, method: ${method},`,
        `path: ${path}`
      );
      logger.debug('query:', query);
      logger.debug('body:', body);
      const response = await client.request(method, path, payload);
      logger.debug('server response:', response ? response : 'null');
      if (response) return res.status(200).json(response);
      // return 404 when response is null due to
      // resource not being found on server
      return res.status(404).json({ message: 'not found' });
    } catch (error) {
      logger.error('Error querying bcoin node:', error);
      return res.status(200).json({ error: { message: error.message } });
    }
  });

  return bcoinRouter;
};

module.exports = routerWithClient;
