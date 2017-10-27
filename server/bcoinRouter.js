'use strict';

const path = require('path');

const express = require('express');
const request = require('request');
// const auth = require('basic-auth');
const Client = require('bcoin').http.Client;

const config = require(path.resolve(__dirname, '../bcoin.config.json'));

const bcoinClient = new Client(config);
const bcoinRouter = express.Router({ mergeParams: true });

// Primary router for preparing the requests to send to bcoin node
bcoinRouter.use(async (req, res) => {
  // let authorization;

  // if (auth(req)) {
  //   authorization = {
  //     user: auth(req).name,
  //     pass: auth(req).pass,
  //     sendImmediately: false,
  //   };
  // }

  const options = {
    method: req.method,
    uri: req.path,
    body: req.body,
    json: true,
    qs: req.query
    // auth: authorization,
  };

  const { method, path, body } = req;

  try {
    const bcoinResponse = await bcoinClient._request(method, path, body);
    return res.status(200).json(bcoinResponse);
  } catch (error) {
    console.log('got an error querying bcoin node!', error);
    return res.status(400).send({ error });
  }
});

module.exports = bcoinRouter;
