const path = require('path');
const assert = require('assert');
const fs = require('fs');
const { execSync } = require('child_process');
const getOpt = require('node-getopt');

const init = schema => {
  // build cli options list
  const cliOptions = Object.entries(schema).map(([key, val]) => [
    val.short,
    val.long,
    val.description
  ]);

  // initialize cli
  const opt = getOpt
    .create(cliOptions)
    .bindHelp()
    .parseSystem();

  log('passed options:');
  log(opt.options);

  // grab specific cli options for each application
  const bcoinOpts = filterOpts(schema, opt.options, 'bcoin');
  const dockerOpts = filterOpts(schema, opt.options, 'docker');
  const bpanelOpts = filterOpts(schema, opt.options, 'bpanel');

  log('bcoinOpts');
  log(bcoinOpts);
  log('dockerOpts');
  log(dockerOpts);
  log('bpanelOpts');
  log(bpanelOpts);

  // validate each of the options
  validate(schema, bcoinOpts);
  validate(schema, dockerOpts);
  validate(schema, bpanelOpts);

  // use provided outfile or default outfile
  const outfile = bpanelOpts.outfile || schema.outfile.default;
  log('outfile:');
  log(outfile);

  // determine if any bcoin specific args were passed
  const anyBcoinArgs =
    Object.keys(opt.options).filter(el => {
      if (schema[el]) {
        return schema[el].app === 'bcoin';
      }
    }).length > 0;

  // determine if a specified outfile was passed
  const isSpecifiedOutfile = !!opt.options.outfile;

  // write bcoin env file only if bcoin args passed or
  // an outfile was specified
  if (anyBcoinArgs || isSpecifiedOutfile) {
    let fd;
    try {
      fd = fs.openSync(outfile, 'w');
      for ([key, val] of Object.entries(bcoinOpts)) {
        // filter out empty values
        if (val.toString().length) {
          let formattedKey = toSnakeCase(key);
          let str = `BCOIN_${formattedKey}=${val}`;
          log(`writing - ${str}`);
          fs.appendFileSync(fd, `${str}\n`);
        }
      }
    } finally {
      fs.closeSync(fd);
    }
  }

  // get docker-compose start command
  let cmd = dockerOpts.detached ? 'docker-compose up -d' : 'docker-compose up';
  log(`running: ${cmd}`);
  execSync(cmd, { stdio: [0, 1, 2] });
};

// cli schema
const schema = {
  prefix: {
    app: 'bcoin',
    default: '/code/.bcoin',
    validation: '',
    short: '',
    long: 'prefix=',
    description: 'path to bcoin data directory'
  },
  network: {
    app: 'bcoin',
    default: 'regtest',
    validation: /main|testnet|regtest|simnet/,
    short: '',
    long: 'network=',
    description: 'bcoin network'
  },
  workers: {
    app: 'bcoin',
    default: true,
    validation: /true|false/,
    short: '',
    long: 'workers=',
    description: 'use bcoin workers for txn verification'
  },
  'http-host': {
    app: 'bcoin',
    default: '0.0.0.0',
    validation: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
    short: '',
    long: 'http-host=',
    description: 'bcoin http-host'
  },
  'wallet-http-host': {
    app: 'bcoin',
    default: '0.0.0.0',
    validation: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
    short: '',
    long: 'wallet-http-host=',
    description: 'wallet server http-host'
  },
  'log-level': {
    app: 'bcoin',
    default: 'debug',
    validation: /error|warning|info|debug|spam/,
    short: '',
    long: 'log-level=',
    description: 'bcoin log level'
  },
  memory: {
    app: 'bcoin',
    default: false,
    validation: /true|false/,
    short: '',
    long: 'memory=',
    description: 'use in memory bcoin database'
  },
  listen: {
    app: 'bcoin',
    default: true,
    validation: /true|false/,
    short: '',
    long: 'listen=',
    description: 'bcoin accept incoming connections'
  },
  prune: {
    app: 'bcoin',
    default: false,
    validation: /true|false/,
    short: '',
    long: 'prune=',
    description: '', // TODO
    opts: {
      main: true,
      testnet: true,
      regtest: false,
      simnet: false
    }
  },
  seeds: {
    app: 'bcoin',
    default: '',
    validation: '',
    short: '',
    long: 'seeds=',
    description: 'comma separated string of bcoin seeds'
  },
  'wallet-port': {
    app: 'bcoin',
    default: '',
    validation: '', // TODO
    short: '',
    long: 'wallet-port=',
    description: 'port to run wallet server on',
    opts: {
      main: 8334,
      testnet: 18334,
      regtest: 48334,
      simnet: 18558
    }
  },
  uri: {
    app: 'bcoin',
    default: '',
    validation: '', // TODO
    short: '',
    long: 'uri=',
    description: 'bcoin uri',
    opts: {
      main: 'http://localhost:8332',
      testnet: 'http://localhost:18332',
      regtest: 'http://localhost:48332',
      simnet: 'http://localhost:18556'
    }
  },
  detached: {
    app: 'docker',
    default: false,
    validation: '',
    short: 'd',
    long: 'detached',
    description: 'run docker-compse in detached mode'
  },
  outfile: {
    app: 'bpanel',
    default: 'bcoin.env',
    validation: '',
    short: 'o',
    long: 'outfile=',
    description: 'file to write bcoin env variables to'
  },
  'init-script': {
    app: 'bcoin',
    default: '',
    validation: '',
    short: '',
    long: 'init-script=',
    description: 'script to run at start up'
  }
};

// helper functions
const handleBadInput = (key, val, msg = '') => {
  return `Invalid key/value: ${key} ${val} ${msg}`;
};

const toSnakeCase = key => {
  return key.toUpperCase().replace(/-/, '_');
};

// use the validation key in the schema to assert the
// user input is valid
const validate = (schema, options) => {
  for ([key, val] of Object.entries(options)) {
    assert(
      val.toString().match(schema[key].validation),
      handleBadInput(key, val)
    );
  }
};

const log = input => {
  if (process.env.USE_LOGGER) {
    console.log(input);
  }
};

const filterOpts = (schema, options, filterKey) => {
  const defaults = {};
  // use passed in network or the default network
  const network = options.network || schema.network.default;
  Object.entries(schema).forEach(([key, val]) => {
    if (val.app === filterKey) {
      // passed in value highest precedence
      if (options[key]) {
        defaults[key] = options[key];
        // network associated value 2nd highest
      } else if (val.opts) {
        defaults[key] = val.opts[network];
        // otherwise use default value if it has a value
      } else if (val.default.toString().length) {
        defaults[key] = val.default;
      }
    }
  });
  return defaults;
};

// start the script
init(schema);
