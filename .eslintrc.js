const config = require('./configs/webpack.config.js');

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
      excludedFiles: '**/node_modules',
      env: {
        node: false,
        browser: true,
        commonjs: true
      },
      globals: {
        NODE_ENV: true,
        BPANEL_SOCKET_PORT: true,
        SECRETS: true
      }
    },
    {
      files: ['webapp/test/**/*.js', 'server/test/**/*.js'],
      env: {
        mocha: true
      }
    }
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-param-reassign': 'warn'
  },
  settings: {
    react: {
      version: '^16.3.0'
    },
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
