const { parent } = require('bthreads');
const nodemon = require('nodemon');

parent.on('test', console.log);

const b = () => {};

b();
