/*
 * Utility borrowed from bcoin lib
 */

'use strict';

const assert = require('bsert');
const { FullNode } = require('bcoin');
const { SPVNode } = require('bcoin');

const { NodeClient, WalletClient } = require('bclient');
const walletPlugin = require('bcoin/lib/wallet/plugin');

const shared = {
  apiKey: 'foo',
  network: 'regtest'
};

async function initFullNode(options) {
  const node = new FullNode({
    prefix: options.prefix || null,
    network: shared.network,
    apiKey: options.apiKey || shared.apiKey,
    walletAuth: true,
    workers: true,
    listen: true,
    bip37: true,
    port: options.ports.p2p,
    httpPort: options.ports.node,
    maxOutbound: 1,
    seeds: [],
    memory: options.memory ? true : false,
    plugins: [walletPlugin],
    env: {
      BCOIN_WALLET_HTTP_PORT: options.ports.wallet.toString()
    },
    logLevel: options.logLevel
  });
  await node.ensure();
  await node.open();
  await node.connect();
  return node;
}

async function initSPVNode(options) {
  const node = new SPVNode({
    prefix: options.prefix || null,
    network: shared.network,
    cors: true,
    apiKey: shared.apiKey,
    walletAuth: true,
    workers: true,
    listen: true,
    port: options.ports.p2p,
    httpPort: options.ports.node,
    maxOutbound: 1,
    seeds: [],
    nodes: [`127.0.0.1:${options.ports.p2p}`],
    memory: options.memory ? true : false,
    plugins: [walletPlugin],
    env: {
      BCOIN_WALLET_HTTP_PORT: options.ports.wallet.toString()
    },
    logLevel: options.logLevel
  });
  await node.ensure();
  await node.open();
  await node.connect();
  await node.startSync();
  return node;
}

async function initNodeClient(options) {
  const nclient = new NodeClient({
    network: shared.network,
    port: options.ports.node,
    apiKey: shared.apiKey
  });
  await nclient.open();
  return nclient;
}

async function initWalletClient(options) {
  const wclient = new WalletClient({
    network: shared.network,
    port: options.ports.wallet,
    apiKey: shared.apiKey
  });
  await wclient.open();
  return wclient;
}

async function initWallet(wclient) {
  const winfo = await wclient.createWallet('test');
  assert.strictEqual(winfo.id, 'test');
  const wallet = wclient.wallet('test', winfo.token);
  // await wallet.open();

  // We don't use witness here yet, as there is an activation
  // threshold before segwit can be activated.
  const info = await wallet.createAccount('blue', { witness: false });
  assert(info.initialized);
  assert.strictEqual(info.name, 'blue');
  assert.strictEqual(info.accountIndex, 1);
  assert.strictEqual(info.m, 1);
  assert.strictEqual(info.n, 1);

  return wallet;
}

async function generateBlocks(count, nclient, coinbase) {
  return await nclient.execute('generatetoaddress', [count, coinbase]);
}

async function generateTxs(options) {
  const { wclient, count } = options;

  await wclient.execute('selectwallet', ['test']);

  for (var i = 0; i < count; i++) {
    const addr = await wclient.execute('getnewaddress', ['blue']);
    await wclient.execute('sendtoaddress', [addr, 0.11111111]);
  }
}

async function generateInitialBlocks(options) {
  const { nclient, wclient, coinbase, genesisTime = 1534965859 } = options;
  let { blocks } = options;

  if (!blocks) blocks = 100;

  const blockInterval = 600;
  const timewarp = 3200;

  let c = 0;

  // Establish baseline block interval for a median time
  for (; c < 11; c++) {
    let blocktime = genesisTime + c * blockInterval;
    await nclient.execute('setmocktime', [blocktime]);

    const blockhashes = await generateBlocks(1, nclient, coinbase);
    const block = await nclient.execute('getblock', [blockhashes[0]]);

    assert(block.time <= blocktime + 1);
    assert(block.time >= blocktime);
  }

  // Generate time warping blocks that have time previous
  // to the previous block
  for (; c < blocks; c++) {
    let blocktime = genesisTime + c * blockInterval;
    if (c % 5) blocktime -= timewarp;
    await nclient.execute('setmocktime', [blocktime]);

    // TODO
    // Use an event to wait for wallets to catch up so that
    // funds can be spent

    // If the wallet client is available and there have been
    // enough blocks for coinbase to mature, generate transactions
    // for the block. Additionally the wallet may not be in lockstep
    // sync with the chain, so it's necessary to wait a few more blocks.
    if (wclient && c > 115) await generateTxs({ wclient: wclient, count: 50 });

    const blockhashes = await generateBlocks(1, nclient, coinbase);
    const block = await nclient.execute('getblock', [blockhashes[0]]);

    assert(block.time <= blocktime + 1);
    assert(block.time >= blocktime);
  }
}

module.exports = {
  initFullNode,
  initSPVNode,
  initNodeClient,
  initWalletClient,
  initWallet,
  generateBlocks,
  generateInitialBlocks
};
