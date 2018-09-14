const webpackConfig = require('./configs/webpack.common.config.js');

module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    exclude: ['node_modules/**/test/*.js'],
    files: ['node_modules/babel-polyfill/dist/polyfill.js', 'test/*-test.js'],
    preprocessors: {
      'test/*-test.js': ['webpack', 'sourcemap'],
      'node_modules/*.js': ['webpack']
    },
    // karma doesn't like webpack 4's splitChunks optimization
    // so we replace it here
    webpack: { ...webpackConfig },
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
