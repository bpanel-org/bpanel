const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const loaders = {
  css: {
    loader: 'css-loader',
    options: {
      sourceMap: true
    }
  },
  sass: {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      includePaths: [path.resolve(__dirname, './webapp/styles/')]
    }
  },
  postcss: {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: function() {
        return [autoprefixer];
      }
    }
  }
};

module.exports = function(env={}) {
  const plugins = [];
  if (env.dev) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: true,
        compress: { warnings: false }
      })
    );
  }

  return {
    entry: ['whatwg-fetch', './webapp/index'],
    node: { __dirname: true },
    target: 'web',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    watchOptions: {
      poll: env.poll && (parseInt(env.poll) || 1000),
      ignored: 'webapp/plugins/**/lib/*'
    },
    resolve: {
      symlinks: false,
      extensions: ['-browser.js', '.js', '.json', '.jsx'],
      alias: {
        bcoin: path.resolve(__dirname, 'node_modules/bcoin/lib/bcoin-browser'),
        bpanel: path.resolve(__dirname, 'webapp/'),
        tinycolor: 'tinycolor2'
      }
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['env', 'react', 'stage-3'],
            plugins: [
              [
                'syntax-dynamic-import',
                'transform-runtime',
                {
                  helpers: true,
                  polyfill: true,
                  regenerator: true
                }
              ]
            ]
          }
        },
        {
          test: /\.(scss|css)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [loaders.css, loaders.postcss, loaders.sass]
          })
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets/'
              }
            }
          ]
        }
      ]
    },
    plugins: plugins.concat(
      new ExtractTextPlugin('[name].css'),
      new WebpackShellPlugin({
        onBuildStart: ['echo "Webpack Start"', 'npm run -s build:plugins']
      }),
      new webpack.DefinePlugin({
        NODE_ENV: `"${process.env.NODE_ENV}"`
      }),
      new CompressionPlugin({
        test: /\.js$/,
        algorithm: 'gzip',
        asset: '[path].gz[query]'
      })
    )
  };
};
