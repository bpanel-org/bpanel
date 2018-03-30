'use strict';

const express = require('express');
const logger = require('./logger');
const bcoinRouter = express.Router({ mergeParams: true });

const routerWithClient = client =>
  // Primary router for preparing the requests to send to bcoin node
  bcoinRouter.use(async (req, res, next) => {
    const { method, path, body } = req;
    try {
      const bcoinResponse = await client.request(method, path, body);
      if (bcoinResponse) return res.status(200).json(bcoinResponse);
      next();
    } catch (error) {
      logger.error('Error querying bcoin node:', error);
      return next(error);
    }
  });

module.exports = routerWithClient;
