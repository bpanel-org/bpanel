const webpackConfig = require('./webpack.config.js');

module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      '../node_modules/babel-polyfill/dist/polyfill.js',
      '../webapp/test/index.js'
    ],
    preprocessors: {
      '../webapp/test/index.js': ['webpack']
    },
    webpack: { ...webpackConfig(), mode: 'development' },
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
