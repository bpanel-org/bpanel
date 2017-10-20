const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../webapp/index.html'));
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port')); // eslint-disable-line no-console
});
