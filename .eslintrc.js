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
      files: ['webapp/**/*.js'],
      env: {
        node: false,
        browser: true,
        commonjs: true
      },
      globals: {
        NODE_ENV: true
      }
    },
    {
      files: ['webapp/tests/**/*.js'],
      env: {
        mocha: true
      }
    }
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }]
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
