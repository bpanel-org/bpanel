const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const loaders = {
  css: {
    loader: 'css-loader'
  },
  sass: {
    loader: 'sass-loader',
    options: {
      includePaths: [path.resolve(__dirname, './webapp/styles/main')]
    }
  },
  postcss: {
    loader: 'postcss-loader',
    options: {
      plugins: function() {
        return [autoprefixer];
      }
    }
  }
};

module.exports = {
  entry: './webapp/index',
  target: 'web',
  devtool: 'eval-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['-browser.js', '.js', '.json', '.jsx'],
    alias: {
      bcoin: path.resolve(__dirname, 'node_modules/bcoin/lib/bcoin-browser')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
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
  plugins: [
    new UglifyJSPlugin({ sourceMap: true }),
    new ExtractTextPlugin('[name].css')
  ]
};
