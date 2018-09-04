const path = require('path');
const os = require('os');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.config.js');

const loaders = {
  styleLoader: {
    loader: 'style-loader',
    options: { includePaths: ['node_modules'] }
  },
  css: {
    loader: 'css-loader',
    options: { includePaths: ['node_modules'] }
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

module.exports = function(env = {}) {
  const plugins = [];
  const config = common(env);
  return merge.smart(config, {
    mode: 'production',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          fallback: loaders.styleLoader,
          use: [loaders.css, loaders.postcss]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css'
      }),
      new CompressionPlugin({
        test: /\.js$/,
        algorithm: 'gzip',
        asset: '[path].gz[query]'
      })
    ]
  });
};
