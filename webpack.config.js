const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-synchronizable-shell-plugin');

const loaders = {
  css: {
    loader: 'css-loader'
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

  if (!env.dev) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        safari10: true,
        minimize: true,
        sourceMap: true,
        compress: { warnings: false }
      })
    );
  }

  const nodeModsDir = path.resolve(__dirname, 'node_modules');
  const outputPath = path.resolve(__dirname, 'dist');

  if (env.dev) {
    const vendorManifest = path.join(
      __dirname,
      './dist',
      'vendor-manifest.json'
    );

    plugins.push(
      new webpack.DllReferencePlugin({
        manifest: require(vendorManifest),
        name: 'vendor_lib',
        scope: 'mapped'
      })
    );
  }
  return {
    context: __dirname,
    entry: ['whatwg-fetch', './webapp/index'],
    node: { __dirname: true },
    target: 'web',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].bundle.js',
      path: outputPath,
      libraryTarget: 'umd'
    },
    watchOptions: {
      poll: env.poll && (parseInt(env.poll) || 1000),
      ignored: [
        'webapp/plugins/**/lib/*',
        'node_modules/bcoin',
        'node_modules/bcash',
        'node_modules/hsd'
      ]
    },
    resolve: {
      symlinks: false,
      extensions: ['-browser.js', '.js', '.json', '.jsx'],
      alias: {
        bcoin$: `${nodeModsDir}/bcoin/lib/bcoin-browser`,
        bcash$: `${nodeModsDir}/bcash/lib/bcoin-browser`,
        hsd$: `${nodeModsDir}/hsd/lib/hsd-browser`,
        react: `${nodeModsDir}/react`,
        '&local': path.resolve(process.env.BPANEL_PREFIX, 'local_plugins'),
        '@bpanel': path.resolve(__dirname, 'node_modules/@bpanel'),
        tinycolor: 'tinycolor2'
      }
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: path.resolve(__dirname, 'node_modules'),
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
                  regenerator: true
                }
              ]
            ]
          }
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [loaders.css, loaders.postcss]
          })
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
      new ExtractTextPlugin('[name].css'),
      new WebpackShellPlugin({
        onBuildStart: {
          scripts: [
            `node ${path.resolve(__dirname, 'server/clear-plugins')}`,
            `node ${path.resolve(__dirname, 'server/build-plugins')} --prefix=${
              process.env.BPANEL_PREFIX
            }`
          ],
          blocking: true
        }
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
