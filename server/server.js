const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const bcoinRouter = require('./bcoinRouter');

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../webapp/index.html'));
});

// route to get server info
app.get('/server', (req, res) =>
  res.status(200).send({ bcoinUri: process.env.BCOIN_URI })
);

app.use('/node', bcoinRouter);

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port')); // eslint-disable-line no-console
});

const http = require('http');
const bsock = require('bsock');
const io = bsock.createServer();
const server = http.createServer();
const bcoin = require('bcoin');
const Client = bcoin.http.Client;

const config = require(path.resolve(__dirname, '../configs/bcoin.config.json'));
const { network, uri, apiKey } = config;
const bcoinClient = new Client({ network, uri, apiKey });

io.attach(server);

io.on('socket', async socket => {
  console.log('connected');
  // Bind = listen for event
  socket.bind('bar', data => {
    console.log('Received bar: %s.', data.toString('ascii'));
  });
  // Hook = listen for call (event + ack)
  socket.hook('foo', async () => {
    return Buffer.from('bar');
  });

  await bcoinClient.open();
  bcoinClient.socket.emit('auth');
  bcoinClient.socket.emit('watch chain');
  bcoinClient.socket.on('chain connect', async raw => {
    const progress = await bcoinClient.getInfo();
    console.log('progress: ', progress.chain.progress);
    socket.fire('chain progress', progress.chain.progress);
  });
});

server.listen(8000, () => console.log('socket server connected!'));
