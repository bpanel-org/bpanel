const path = require('path');
const os = require('os');
const webpack = require('webpack');

const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('./webpack.common.config.js');
const { ROOT_DIR, DIST_DIR, SRC_DIR, MODULES_DIR } = require('./constants');

// can be passed by server process via bcfg interface
// or passed manually when running webpack from command line
// defaults to `~/.bpanel`
const bpanelPrefix =
  process.env.BPANEL_PREFIX || path.resolve(os.homedir(), '.bpanel');

module.exports = function(env = {}) {
  const plugins = [];

  const vendorManifest = path.join(DIST_DIR, 'vendor-manifest.json');

  let dllPlugin = null;
  try {
    dllPlugin = new webpack.DllReferencePlugin({
      manifest: require(vendorManifest),
      name: 'vendor_lib',
      scope: 'mapped'
    });
    if (dllPlugin) plugins.push(dllPlugin);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('There was an error building DllReferencePlugin:', e);
  }

  return merge.smart(config(), {
    context: ROOT_DIR,
    mode: 'development',
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        // include all types of chunks
        // cache bcoin vendor files
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules\/(bcoin|bcash|hsd)[\\/]/,
            name: 'bcoin-vendor',
            chunks: 'all'
          }
        }
      }
    },
    entry: [`${path.resolve(SRC_DIR, 'index.js')}`],
    node: { __dirname: true },
    target: 'web',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].[contenthash].js',
      path: DIST_DIR,
      libraryTarget: 'umd'
    },
    watchOptions: {
      // generally use poll for mac environments
      poll: env.poll && (parseInt(env.poll) || 1000)
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader'
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: [MODULES_DIR, path.resolve(bpanelPrefix, 'local_plugins')],
          loader: 'babel-loader',
          query: {
            presets: ['env', 'react', 'stage-3'],
            plugins: [
              [
                'syntax-dynamic-import',
                'transform-object-rest-spread',
                'transform-runtime',
                {
                  helpers: true,
                  polyfill: true,
                  regenerator: true,
                  modules: false
                }
              ]
            ]
          }
        },
        {
          test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader'
        },
        {
          test: /\.(png|jpg|gif|ico)$/,
          loader: 'file-loader',
          options: {
            name(file) {
              const { name } = path.parse(file);
              // this lets us keep name for favicon use
              if (name === 'logo' || name === 'favicon') {
                return '[name].[ext]?[hash]';
              }

              return '[hash].[ext]';
            }
          }
        }
      ]
    },
    plugins: plugins.concat(
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    )
  });
};
