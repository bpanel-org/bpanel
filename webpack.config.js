const webpack = require('webpack');
const path = require('path');
const { execSync } = require('child_process');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const WebpackShellPlugin = require('webpack-shell-plugin');

let commitHash = ''
let version = 'bpanel';
try {
  commitHash = execSync('git rev-parse HEAD').toString();
  version = execSync(
    'git describe --tags $(git rev-list --tags --max-count=1)'
  ).toString();
} catch (e) { }

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

module.exports = function(env) {
  env = env || process.env;
  return {
    entry: ['whatwg-fetch', './webapp/index'],
    node: { __dirname: true },
    target: 'web',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
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
    plugins: [
      new UglifyJSPlugin({ sourceMap: true }),
      new ExtractTextPlugin('[name].css'),
      new WebpackShellPlugin({
        onBuildStart: ['echo "Webpack Start"', 'npm run -s build:plugins']
      }),
      new webpack.DefinePlugin({
        'process.env': {
          BCOIN_URI: JSON.stringify(env.BCOIN_URI),
          NODE_ENV: JSON.stringify(env.NODE_ENV),
          __COMMIT__: JSON.stringify(commitHash),
          __VERSION__: JSON.stringify(version)
        }
      })
    ]
  };
};
