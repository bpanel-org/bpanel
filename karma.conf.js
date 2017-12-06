const webpackConfig = require('./webpack.config');

module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    exclude: ['node_modules/**/test/*.js'],
    files: ['webapp/**/tests/**/*test.js'],
    preprocessors: {
      'webapp/**/tests/**/*test.js': ['webpack']
    },
    webpack: webpackConfig,
    reporters: ['nyan'],
    port: 9876,
    colors: true,
    autoWatch: true,
    browsers: ['PhantomJS'],
    concurrency: Infinity
  });
};
