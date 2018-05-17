#!/bin/bash

echo "starting init.js and bmultisig"
# start bcoin and start multisig server
node /code/scripts/docker-bcoin-init.js & /code/node_modules/bmultisig/bin/bmultisig fg

