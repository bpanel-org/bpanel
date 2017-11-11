const http = require('http');
const path = require('path');
const bsock = require('bsock');
const io = bsock.createServer();
const socketServer = http.createServer();
const bcoin = require('bcoin');
const Client = bcoin.http.Client;

const config = require(path.resolve(__dirname, '../configs/bcoin.config.json'));
const { network, uri, apiKey } = config;
const bcoinClient = new Client({ network, uri, apiKey });

io.attach(socketServer);

io.on('socket', async socket => {
  await bcoinClient.open();
  bcoinClient.socket.emit('auth');
  bcoinClient.socket.emit('watch chain');
  bcoinClient.socket.on('chain connect', async () => {
    const progress = await bcoinClient.getInfo();
    socket.fire('chain progress', progress.chain.progress);
  });
});

module.exports = socketServer;
