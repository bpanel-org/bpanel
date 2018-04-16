// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');

const PORT = process.env.NODE_PORT || 8000;
const keyfile = process.env.TLS_KEY_PATH || '/app/server.key';
const certfile = process.env.TLS_CERT_PATH || '/app/server.crt';

const options = {
  key: fs.readFileSync(keyfile),
  cert: fs.readFileSync(certfile)
};

https
  .createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('{ "msg": "you are safe (sort of)" }\n');
  })
  .listen(PORT);
