const path = require('path');
const config = require('./webpack.config.js');

module.exports = {
  parser: 'babel-eslint',
  plugins: ['prettier', 'react'],
  env: {
    browser: true,
    mocha: true,
    node: true,
    es6: true
  },
  rules: {
    'prettier/prettier': 'error'
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: config({})
      }
    }
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors'
  ]
};
