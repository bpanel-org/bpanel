'use strict';

const express = require('express');
const logger = require('./logger');
const bcoinRouter = express.Router({ mergeParams: true });

const routerWithClient = nodeClient =>
  // Primary router for preparing the requests to send to bcoin node
  bcoinRouter.use(async (req, res, next) => {
    const { method, path, body } = req;
    try {
      const bcoinResponse = await nodeClient.request(method, path, body);
      return res.status(200).json(bcoinResponse);
    } catch (error) {
      logger.error('Error querying bcoin node:', error);
      const err = new Error('There was a problem querying the bcoin node');
      err.status = 400;
      return next(err);
    }
  });

module.exports = routerWithClient;
