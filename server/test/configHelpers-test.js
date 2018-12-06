const { assert } = require('chai');
const Config = require('bcfg');
const fs = require('bfile');
const os = require('os');
const { resolve } = require('path');

const logger = require('../logger');
const { initFullNode } = require('./utils/regtest');

const { configHelpers } = require('../utils');
const {
  loadConfig,
  createClientConfig,
  testConfigOptions,
  getConfig,
  ClientErrors
} = configHelpers;

// setup tmp directory for testing
const testDir = resolve(os.homedir(), '.bpanel_tmp');
process.env.BPANEL_PREFIX = testDir;
process.env.BPANEL_CLIENTS_DIR = 'test_clients';
const { BPANEL_PREFIX, BPANEL_CLIENTS_DIR } = process.env;
const clientsDirPath = resolve(BPANEL_PREFIX, BPANEL_CLIENTS_DIR);

describe.only('configHelpers', () => {
  let node, apiKey, ports, options, id, config;

  before('create and start regtest node', async () => {
    logger.transports.console.level = 'error';
    logger.transports.file.level = 'error';
    id = 'test';
    apiKey = 'foo';
    ports = {
      p2p: 49331,
      node: 49332,
      wallet: 49333
    };
    node = await initFullNode({
      ports: ports,
      memory: true,
      logLevel: 'none',
      apiKey
    });
  });

  after('close node and remove testing directory', async function() {
    await node.close();
    if (fs.existsSync(testDir)) {
      fs.rimrafSync(testDir);
    }
  });

  beforeEach(() => {
    config = new Config(id);
    options = {
      id,
      chain: 'bitcoin',
      port: ports.node,
      network: 'regtest',
      apiKey,
      'wallet-port': ports.wallet,
      multisigWallet: false
    };
  });

  describe('testConfigOptions', () => {
    it('should not throw if clients are valid', async () => {
      config.inject(options);
      await testConfigOptions(config);
    });

    it('should throw error with property for each client(s) that failed', async () => {
      options.apiKey = 'bar';
      options.walletport = 123;

      config.inject(options);

      const [err, clientErrors] = await testConfigOptions(config);
      assert(err, 'Expected testConfigOptions to have an error');
      assert.includeMembers(
        clientErrors.failed,
        ['node', 'wallet'],
        'Expected failures for node and wallet clients'
      );

      // since we're testing specific errors, want to make sure the test is
      // setup correctly
      assert(
        options.apiKey !== apiKey && options.walletport !== ports.wallet,
        'api key and wallet port options should not match node when testing failures'
      );
      assert.include(
        clientErrors.node.message,
        'Unauthorized',
        'Node should have failed because of bad API key'
      );
      assert.include(
        clientErrors.wallet.message,
        'ECONNREFUSED',
        'Wallet client connection should have failed because of bad port'
      );
    });
  });

  describe('createClientConfig', () => {
    it('should accept options object or a bcfg object', async () => {
      await createClientConfig(id, options, true);
      config.inject(options);
      await createClientConfig(id, config, true);
    });

    it('should test clients', async () => {
      const failOpts = { ...options, apiKey: 'bar' };
      let passed = false;

      try {
        await createClientConfig(id, failOpts);
        passed = true;
      } catch (e) {
        assert.instanceOf(
          e,
          ClientErrors,
          'Expected to throw a ClientErrors error'
        );
      }
      assert(!passed, 'Expected to fail with bad options');
    });

    it('should create new config file in clients directory with correct configs', async () => {
      config.inject(options);
      await createClientConfig(id, options);
      const { BPANEL_PREFIX, BPANEL_CLIENTS_DIR } = process.env;
      const clientPath = resolve(
        BPANEL_PREFIX,
        BPANEL_CLIENTS_DIR,
        `${id}.conf`
      );

      assert(
        fs.existsSync(clientPath),
        'Could not find config file at expected path'
      );

      const loadedConfigs = loadConfig(id, { id, prefix: clientsDirPath });
      loadedConfigs.open(`${id}.conf`);
      await testConfigOptions(loadedConfigs.data);
    });
  });

  describe('getConfig', () => {
    it('should get the config object from a config file', async () => {
      await createClientConfig(id, options);
      const config = await getConfig(id);
      assert.instanceOf(config, Config, 'Expected to get a bcfg object');
      const expectedConfigs = loadConfig(id, options);

      // need to do a custom deep comparison with non-strict comparisons
      // because of the way bcfg converts
      // `data` contains the configs loaded from a file
      // `options` contains configs injected from options
      const actualKeys = Object.keys(config.data);
      const expectedKeys = Object.keys(expectedConfigs.options);
      assert.equal(
        actualKeys.length,
        expectedKeys.length,
        'Wrong number of properties'
      );
      for (let key of actualKeys) {
        let actual = config.data[key];
        let expected = expectedConfigs.options[key];

        // bools don't get inserted consistently to config object
        if (actual === 'false' || actual === 'true')
          actual = JSON.parse(actual);
        if (expected === 'false' || expected === 'true')
          expected = JSON.parse(expected);

        assert.equal(
          actual,
          expected,
          `Actual ${key} in config.data did not match expected ${key}`
        );
      }
    });

    it('should throw if config does not exist', async () => {
      const failId = 'fail';
      let failed;
      try {
        await getConfig(failId);
        failed = false;
      } catch (e) {
        failed = true;
      }
      assert(failed, `Expected getConfig to fail for id "${failId}"`);
    });
  });
});
