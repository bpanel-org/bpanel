#!/bin/bash

# start bcoin and start multisig server
echo "starting init.js and bmultisig"
node /code/scripts/docker-bcoin-init.js & /code/node_modules/bmultisig/bin/bmultisig && fg
