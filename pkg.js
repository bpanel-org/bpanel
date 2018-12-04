/*!
 * pkg.js - package constants
 * Copyright (c) 2018, bPanel Devs (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const pkg = exports;

/**
 * Package Name
 * @const {String}
 * @default
 */

pkg.name = require('./package.json').name;

/**
 * Project Name
 * @const {String}
 * @default
 */

pkg.core = 'bpanel';

/**
 * Organization Name
 * @const {String}
 * @default
 */

pkg.organization = 'bpanel-org';

/**
 * Config file name.
 * @const {String}
 * @default
 */

pkg.cfg = `${pkg.core}.conf`;

/**
 * Repository URL.
 * @const {String}
 * @default
 */

pkg.url = `https://github.com/${pkg.organization}/${pkg.name}`;

/**
 * Current version string.
 * @const {String}
 */

pkg.version = require('./package.json').version;

/**
 * Supported blockchains
 * @const {Array}
 */

pkg.chains = ['bitcoin', 'bitcoincash', 'handshake'];

/**
 * Supported user agents
 * @const {Array}
 */

pkg.agents = ['bcoin', 'bcash', 'hsd'];
