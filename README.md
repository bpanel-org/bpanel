# Welcome to bPanel!

This is the official repo for the bPanel project, a full featured, enterprise level GUI for your Bcoin Bitcoin node

## Setup Your Environment With Docker
This is primarily a setup for development purposes (though it could be used in production with some modification).

You can set an API key by creating a `secrets.env` file and set `BCOIN_API_KEY=[YOUR-AWESOME-KEY]`. This key can be any value you want. __DO NOT CHECK THIS FILE IN TO VERSION CONTROL.__

To spin up your webapp, server, a bcoin node on regtest, and generate 50 regtest BTC for your primary wallet, navigate to your repo and run:
1. `npm i`
2. `docker-compose up` (add `--build` if you haven't built the images yet)
3. In a separate terminal tab, run `npm run watch:dev`. This will run webpack for the front-end.
4. Navigate to http://localhost:5000 to see your webapp. Requests to `\node` will get get forwarded to your bcoin node.

## Customizing Your Docker Environment
There are two docker services in the compose file: `app` and `bcoin`. The app service runs the web server which serves the static files for the front end and relays messages to a bcoin node. You can use custom configs to connect to an existing node, or use the bcoin docker service to spin up a bcoin node that the webapp will connect to.

### Configuration
The configs are managed through environment variables. A config file is created and placed in a `configs` directory mounted as a shared volume (named `configs`) for the containers based on these environment variables. This is done by the `docker-config-init.js` file.

Make sure to comment out the environment variables according to the network you want your webapp to connect to and/or what kind of node you want to run if you're running the bcoin service.

### Setup Scripts
Setup scripts are also supported. This will allow you to run scripts on your node for a repeatable and predictable environment for testing or development.
Three circumstances need to be met to run a script:
1. There needs to be a js file to run in the `scripts` directory that exports a function to run
2. You need to pass the name of this file (including the extension) as an environment variable named `BCOIN_INIT_SCRIPT` in the docker-compose
3. There should be no walletdb in the container. This makes sure that a setup script doesn't overwrite your data if you're mapping volumes or if you restart a container.

These checks are done in the `docker-bcoin-init.js` which sets up a node based on the configs described above. Setup scripts will also be passed the bcoin node object that has been created.

### Persistent DBs
To persist your bcoin node information (and skip the setup if the walletdb is persisted, uncomment and edit the volumes in the bcoin service. This could be useful if you're working on testnet or mainnet and don't want to wait for a full sync to happen every time you create a new container.
