const path = require('path');
const config = require('./webpack.config.js');

module.exports = {
  parser: 'babel-eslint',
  plugins: ['prettier', 'react'],
  env: {
    node: true,
    es6: true
  },
  overrides: [
    {
      "files": ["webapp/**/*.js"],
      "env": {
        "node": false,
        "browser": true,
      }
    }, {
      "files": ["webapp/tests/**/*.js"],
      "env": { "mocha": true }
    },
  ],
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
