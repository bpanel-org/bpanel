const webpackConfig = require('./configs/webpack.config.js');

module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    exclude: ['node_modules/**/test/*.js'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/whatwg-fetch/fetch.js',
      'webapp/tests/*-test.js'
    ],
    preprocessors: {
      'webapp/tests/*.js': ['webpack', 'sourcemap'],
      'node_modules/*.js': ['webpack']
    },
    webpack: webpackConfig({}),
    webpackServer: {
      noInfo: true,
      quiet: true
    },
    reporters: ['nyan'],
    port: 9876,
    colors: true,
    autoWatch: true,
    concurrency: Infinity,
    browsers: ['Firefox']
  });
};
