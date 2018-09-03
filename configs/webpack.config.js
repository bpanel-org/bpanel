const path = require('path');
const os = require('os');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPlugin = require('webpack-synchronizable-shell-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
  ROOT_DIR,
  DIST_DIR,
  SRC_DIR,
  SERVER_DIR,
  MODULES_DIR
} = require('./constants');

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

  return {
    context: ROOT_DIR,
    mode: 'development',
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        // include all types of chunks
        chunks: 'all',
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
    entry: ['whatwg-fetch', `${path.resolve(SRC_DIR, 'index.js')}`],
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
    resolve: {
      symlinks: false,
      extensions: ['-browser.js', '.js', '.json', '.jsx'],
      // list of aliases are what packages plugins can list as peerDeps
      // this helps simplify plugin packages and ensures that parent classes
      // all point to the same instance, e.g bcoin.TX will be same for all plugins
      alias: {
        bcoin$: `${MODULES_DIR}/bcoin/lib/bcoin-browser`,
        bcash$: `${MODULES_DIR}/bcash/lib/bcoin-browser`,
        hsd$: `${MODULES_DIR}/hsd/lib/hsd-browser`,
        bledger: `${MODULES_DIR}/bledger/lib/bledger-browser`,
        bmultisig: `${MODULES_DIR}/bmultisig/lib/bmultisig-browser`,
        react: `${MODULES_DIR}/react`,
        'react-redux': `${MODULES_DIR}/react-redux`,
        '&local': path.resolve(bpanelPrefix, 'local_plugins'),
        '@bpanel': `${MODULES_DIR}/@bpanel`,
        '@bpanel/bpanel-utils': `${MODULES_DIR}/@bpanel/bpanel-utils`,
        '@bpanel/bpanel-ui': `${MODULES_DIR}/@bpanel/bpanel-ui`,
        tinycolor: 'tinycolor2'
      }
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
      new HtmlWebpackPlugin({
        title: 'bPanel - A Blockchain Management System',
        template: `${path.join(SRC_DIR, 'index.template.ejs')}`,
        inject: 'body'
      }),
      new CleanWebpackPlugin([DIST_DIR], {
        root: ROOT_DIR,
        exclude: ['vendor-manifest.json', 'vendor.js']
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new WebpackShellPlugin({
        onBuildStart: {
          scripts: [
            `node ${path.resolve(SERVER_DIR, 'clear-plugins.js')}`,
            `node ${path.resolve(
              SERVER_DIR,
              'build-plugins.js'
            )} --prefix=${bpanelPrefix}`
          ],
          blocking: true
        }
      }),
      new webpack.DefinePlugin({
        NODE_ENV: `"${process.env.NODE_ENV}"`
      })
    )
  };
};
