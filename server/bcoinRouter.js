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
      const err = new Error('There was a problem querying the bcoin node');
      err.status = 400;
      return next(err);
    }
  });

module.exports = routerWithClient;
