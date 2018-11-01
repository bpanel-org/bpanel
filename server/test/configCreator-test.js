const { assert } = require('chai');
const Config = require('bcfg');
const fs = require('bfile');
const os = require('os');
const { resolve } = require('path');

const logger = require('../logger');
const { loadConfig } = require('../loadConfigs');
const { initFullNode } = require('./utils/regtest');
const {
  createClientConfig,
  testConfigOptions,
  ClientErrors
} = require('../configCreator');

// setup tmp directory for testing
const testDir = resolve(os.homedir(), '.bpanel_tmp');
process.env.BPANEL_PREFIX = testDir;
process.env.BPANEL_CLIENTS_DIR = 'test_clients';
const { BPANEL_PREFIX, BPANEL_CLIENTS_DIR } = process.env;
const clientsDirPath = resolve(BPANEL_PREFIX, BPANEL_CLIENTS_DIR);

describe('configCreator', () => {
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

      let failed = true;
      try {
        await testConfigOptions(config);
        failed = false;
      } catch (e) {
        assert.includeMembers(
          e.failed,
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
          e.node.message,
          'Unauthorized',
          'Node should have failed because of bad API key'
        );
        assert.include(
          e.wallet.message,
          'ECONNREFUSED',
          'Wallet client connection should have failed because of bad port'
        );
      }
      assert(
        failed,
        'Expected testConfigOptions to fail with incorrect options'
      );
    });
  });

  describe('createClientConfig', () => {
    it('should only take an options object or a bcfg object', async () => {
      let failedOnString = true;
      try {
        await createClientConfig(options);
        config.inject(options);
        await createClientConfig(config);
        await createClientConfig('baz');
        failedOnString = false;
      } catch (e) {
        assert(e);
      }
      assert(failedOnString, 'Should have failed when passed a string');
    });

    it('should test clients', async () => {
      const failOpts = { ...options, apiKey: 'bar' };
      let passed = false;

      try {
        await createClientConfig(failOpts);
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

    it('should create a new config file in correct clients directory with correct configs', async () => {
      config.inject(options);
      await createClientConfig(options);
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
});
