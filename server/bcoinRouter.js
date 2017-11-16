'use strict';

const path = require('path');
const express = require('express');

const Client = require('bcoin').http.Client;
const logger = require('./logger');

const config = require(path.resolve(__dirname, '../configs/bcoin.config.json'));
const { network, uri, apiKey } = config;

const bcoinClient = new Client({ network, uri, apiKey });
const bcoinRouter = express.Router({ mergeParams: true });

// Primary router for preparing the requests to send to bcoin node
bcoinRouter.use(async (req, res, next) => {
  const { method, path, body } = req;

  try {
    const bcoinResponse = await bcoinClient._request(method, path, body);
    return res.status(200).json(bcoinResponse);
  } catch (error) {
    logger.error('Error querying bcoin node:', error);
    const err = new Error('There was a problem querying the bcoin node');
    err.status = 400;
    return next(err);
  }
});

module.exports = bcoinRouter;
