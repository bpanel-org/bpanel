# Welcome to bPanel!

This is the official repo for the [bPanel project](https://bpanel.org),
a full featured, enterprise level GUI for your bcoin Bitcoin node.

For complete developer and API documentation, visit our website: https://bpanel.org

## Table of Contents

- [Dependencies](#dependencies)
- [Quick Start](#quick-start)
  - [Quick Start w/ existing node](#with-an-existing-node)
  - [Quick Start (w/ Docker)](#with-docker)
- [Managing Plugins](#managing-plugins)
- [Configuration](#configuration)
- [About the Docker Environment](#about-the-docker-environment)
- [Extending bPanel](#extending-bpanel)

## Dependencies

- npm >= 5.7.1
- node >= 8.9.4

NOTE: It is important to be using at least this version of `npm`
because of a bug that removes `node_modules` that are installed from
GitHub and doesn't reinstall them which breaks the build.

## Quick Start

### With an existing Node
If you already have a bcoin node running that you would like to use bPanel to
interact with, add the relevant configurations (`uri`, `api-key`, `network` etc.)
to a configuration file `~/.bpanel/clients/default.conf` and run:

```bash
npm install
npm start
```

You can save as many confs for as many compatible nodes as you want and use
the argument `client-id` to connect to them. For example, save another set
of configurations to a file `~/.bpanel/clients/main.conf` and run:

```bash
npm start -- --client-id=main
```

Configurations can also be passed via the command line or environment variables prefaced
with `BPANEL_`. Read more about configuring bPanel [here](#configuration).

### With Docker

From inside the project directory in your terminal, run:

```bash
npm install && docker-compose up -d
```

This will start up three docker containers as [detached processes running in the background](https://docs.docker.com/compose/reference/up/).
Once everything has started up, you should be able to see your bPanel instance
at `localhost:5000`. Note that this can take several minutes as bcoin and bcrypto build
inside the docker container. Use the `docker logs` command to see the logs and check on
progress in your container.

Read more about how to connect a local instance of bPanel to a bcoin node running in docker
[here](#local-bpanel-dev-using-bcoin-docker-container).

## Managing Plugins

Plugin management is handled in a `config.js` file located by default in the `.bpanel` directory in your
system's home directory (this location can be manually changed with the `BPANEL_PREFIX` env variable or
`--prefix` option at run time.

bPanel comes pre-installed with a default theme called [`Genesis Theme`](https://github.com/bpanel-org/genesis-theme)
that bundles together a set of useful starter plugins and a custom skin called [bMenace](https://github.com/bpanel-org/bmenace-theme).
If you want, you can disable the Genesis Theme by removing it from the list in `config.js`,
but if you want to keep using _some_ of the plugins from the theme, feel free to add
them individually to your config!

### Installing Plugins

To install plugins, simply add the name as a string to the `plugins` array in `~/.bpanel/config.js`.
Make sure to match the name to the package name on npm
(`localPlugins` can be used for plugins you are developing in the `plugins/local` directory).
Once you save the file, bPanel will automatically install the plugins and rebuild.

For example:

```javascript
// ~/.bpanel/config.js
export const localPlugins = ['my-local-plugin'];

export const plugins = ['@bpanel/genesis-theme', 'my-plugin'];

export default { localPlugins, plugins };
```

Note that if you have several plugins or themes being loaded,
this can take around 30 seconds as `npm install` is run for you.

Discover all the plugins available by running `npm search bpanel` in your console.

## Configuration

bPanel can be configured to connect to any bcoin-API compatible node you want to
point it to, not just the docker container created by the default
`docker-compose.yml` configurations.

Since bPanel just uses [`bclient`](https://github.com/bcoin-org/bclient) to connect
to and query nodes, all you need to do is pass the appropriate congifurations when starting up
bPanel. This can be done via the command line, environment variables (prefaced with `BPANEL_`),
or through a configuration file. Under the hood, bPanel uses the `bcfg` module
to accomplish this. (Learn more about `bcfg` [here](https://github.com/bcoin-org/bcfg))

bPanel looks for configuration files in your home directory in a `.bpanel` folder
(`~/.bpanel`) by default but this can be changed by passing a `prefix` argument at runtime.
Client configurations for connecting to different nodes are loaded from the `clients`
directory, `~/.bpanel/clients/[CLIENT-ID].conf`.

You can have as many different configurations as you want. bPanel will default to a `default.conf`
configuration. To use different configurations, just pass in a `client-id` argument at runtime.
e.g. `npm start -- --client-id=test` (or as an env variable `BPANEL_CLIENT_ID=test`) which
will load configs from `~/.bpanel/clients/test.conf`.

The clients directory can also be customized with the `clients-dir` argument.

A sample conf file for the clients can be found
[here](https://github.com/bpanel-org/bpanel/tree/master/etc/sample.client.conf).

Since node and wallet services are run on different servers,
you will likely need different configurations to connect to the wallet. These
should be in the same client conf file, prefaced with `wallet-` (note that bcoin looks for these
in separate config files but for bPanel clients we keep them together).
See the sample conf file for an example.

To directly serve bpanel over https without the reverse proxy, set the environment
variables:

```bash
BPANEL_HTTPS=true
BPANEL_TLS_KEY=<path to key>
BPANEL_TLS_CERT=<path to cert>
```

## About the Docker Environment

The default configs in the standard `docker-compose.yml` file
bring up three separate services:

- `securityc` - TLS terminating reverse proxy
- `bpanel` - bPanel routing + static file server (connecting to the regtest node)
- `bcoin` - bcoin bitcoin node/wallet (running a regtest node)

(Some plugins require TLS to function properly e.g. for hardware signing
support).

The `bpanel` service is an http server that acts as a static file server and as a request router
to backend services as well as a webpack process for building your JavaScript files.
The `bcoin` service is an instance of `bcoin` that supports an http
server, a wallet + [bmultisig](https://github.com/bcoin-org/bmultisig) server and a bitcoin p2p server.

The `securityc` service generates TLS keys and certs and runs a TLS terminating reverse proxy.
You can use custom configs to connect to an existing node,
or use the bcoin docker service to spin up a bcoin node that the webapp will connect to.

Learn more about the architecture of bPanel and related services [at our website](https://bpanel.org/docs/bpanel-overview.html#architecture).

#### Configuration between Docker services

These instructions are for if you want to run bPanel within the `bpanel` service and have it talk to
a bcoin node running in a container from the `bcoin` service. This is how, for example, bPanel works
out of the box if you simply run `docker-compose up -d`.

Configurations are shared between the two docker containers using a shared
docker volume called `configs`. Settings for the bcoin nodes in docker
are set using environment variables, either in docker-compose.yml or
an env file (by default in `./etc/regtest.bcoin.env` but you can point to whichever and
as many env files as you want using the `env_file` configuration in the bcoin
service). The bcoin node is started with the `bcoin-init.js` script. During this
process, API keys are generated and all required configurations are saved in a config
file called `_docker.conf` in the shared volume.

#### Local bPanel Dev (non-docker) with bcoin docker service

If the configs volume is mounted and mapped to your host machine, you can connect a local
version of bPanel to it by pointing the `client-id` config at `_docker` and it will
use the appropriate configs.

For local development, you run just the bcoin docker container (`docker-compose up -d bcoin`)
and then `npm run start:dev -- --client-id=_docker` (or `npm run start:poll -- --client-id=_docker`
on Mac to enbable webpack's watch with filesystem polling) to run bPanel and its server
from your local box.

Note that the `--client-id` argument tells bPanel which client config
you want to use. `_docker` is the name of the config automatically created by the bcoin
service.

If you are mounting a local bcoin data dir (`~/.bcoin`) or persisting using docker volumes,
you can also pass settings to your bcoin docker container with a `bcoin.conf`
file (read more about bcoin configurations
[here](https://github.com/bcoin-org/bcoin/blob/master/docs/Configuration.md)).

### Bcoin Setup Scripts

(This section is only relevant if you will be running a bcoin node in a docker container
using the `bcoin` service, or using the `bcoin-init.js` script to start a node.)

This setup supports setup scripts for your bcoin node. This will allow you to run
scripts on your node for a repeatable and predictable environment for testing or development.

Three circumstances need to be met to run a script:

1. There needs to be a js file to run in the `scripts` directory that exports a function
1. You need to pass the name of this file (including the extension)
   as an environment variable named `BCOIN_INIT_SCRIPT` in the docker-compose or as a
   `init-script` setting in your `bcoin.conf` file
1. There should be no walletdb in the container.
   This last requirement makes sure that a setup script doesn't overwrite your data
   if you're mapping volumes or if you restart a container.

These checks are done in `bcoin-init.js` which is run by the bpanel/bcoin image
that is used to create the `bcoin` container and sets up a node based on the configs
described above. Setup scripts are passed the bcoin node object that has been
created so the scripts have access to the node being started at run time as
well as the relevant configs.

Example setup scripts can be found in the `/scripts` directory (`funded-dummy-wallets.js`
and `setup-coinbase-address.js`).

### Persistent DBs

By default, the bcoin and wallet DBs persist in the `bcoin` docker volume.
If you want docker to start bcoin with a fresh DB, comment out the `bcoin`
volume in `docker-compose.yml` then run `docker-compose up -d`. Alternatively, you
can also persist your bcoin data within the named `bcoin` volume or on the host machine.

### Building local images

Uncomment the relevant `build:` sections in `docker-compose.yml`
for the services you want to build, then run `docker-compose build`

## Extending bPanel

The bPanel UI is built entirely around plugins.
All visual elements can be extended or overridden via the plugin system
including the header, footer, sidebar, and main panel/view element.
To get started making your own plugin, use the
[bPanel-cli](http://bpanel.org/docs/plugin-started.html)

### Server extensions

The simplest thing to do, is to create your own server file that includes `server/index.js`.

```javascript
const bpanel = require('bpanel')({
  network: 'main' // Put bPanel configs here (optional)
});
const app = require('express')();
app.use(/* Put your own middleware here */);
app.use(bpanel.app);
app.listen(5000);
```

## Troubleshooting & FAQ
#### Nodejs Memory
With the availability of the bcoin, bcash, and hsd libraries, the webpack build process
requires an above average amount of memory available. To avoid JS Heap overflows, the
npm scripts that run webpack (`start`, `start:dev`, and `start:poll`) pass an argument
`--max_old_space_size` to increase the memory allocation. This can be adjusted as necessary.

## License

- Copyright (c) 2018, The bPanel Devs (MIT License).
