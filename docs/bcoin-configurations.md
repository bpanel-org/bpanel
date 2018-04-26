# bcoin Configuration

### Default/Shared

```bash
BCOIN_HTTP_HOST=0.0.0.0
BCOIN_WALLET_HTTP_HOST=0.0.0.0
BCOIN_LOG_LEVEL=debug
BCOIN_WORKERS=true
BCOIN_LISTEN=true
BCOIN_PREFIX=/code/.bcoin
BCOIN_MEMORY=false
```

### Mainnet

```
BCOIN_URI=http://localhost:8332
BCOIN_PRUNE=true
BCOIN_WALLET_PORT=8334
BCOIN_NETWORK=main
```

### Testnet

```
BCOIN_URI=http://localhost:18332
BCOIN_WALLET_PORT=18334
BCOIN_NETWORK=testnet
BCOIN_PRUNE=true
BCOIN_DB=leveldb
```

### Simnet

```
BCOIN_URI=http://127.0.0.1:18556
BCOIN_NETWORK=simnet
BCOIN_SEEDS=sim.c4yt.io
BCOIN_WALLET_PORT=18558
```

### Regtest

```bash
BCOIN_URI=http://localhost:48332
BCOIN_WALLET_PORT=48334
BCOIN_NETWORK=regtest
```

### Scripts

```
## Mining/Fund wallet - Only for regtest or (sometimes) simnet
BCOIN_INIT_SCRIPT=funded-dummy-wallets.js
BLOCKS_2_MINE=101
```

