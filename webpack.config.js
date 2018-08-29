const path = require('path');
const os = require('os');
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

  // can be passed by server process via bcfg interface
  // or passed manually when running webpack from command line
  // defaults to `~/.bpanel`
  const bpanelPrefix =
    process.env.BPANEL_PREFIX || path.resolve(os.homedir(), '.bpanel');

  if (env.dev) {
    const vendorManifest = path.join(
      __dirname,
      './dist',
      'vendor-manifest.json'
    );

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
      // list of aliases are what packages plugins can list as peerDeps
      // this helps simplify plugin packages and ensures that parent classes
      // all point to the same instance, e.g bcoin.TX will be same for all plugins
      alias: {
        bcoin$: `${nodeModsDir}/bcoin/lib/bcoin-browser`,
        bcash$: `${nodeModsDir}/bcash/lib/bcoin-browser`,
        hsd$: `${nodeModsDir}/hsd/lib/hsd-browser`,
        bledger: `${nodeModsDir}/bledger`,
        bmultisig: `${nodeModsDir}/bmultisig`,
        react: `${nodeModsDir}/react`,
        'react-redux': `${nodeModsDir}/react-redux`,
        '&local': path.resolve(bpanelPrefix, 'local_plugins'),
        '@bpanel': path.resolve(__dirname, 'node_modules/@bpanel'),
        '@bpanel/bpanel-utils': path.resolve(
          __dirname,
          'node_modules/@bpanel/bpanel-utils'
        ),
        '@bpanel/bpanel-ui': path.resolve(
          __dirname,
          'node_modules/@bpanel/bpanel-ui'
        ),
        tinycolor: 'tinycolor2'
      }
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(bpanelPrefix, 'local_plugins')
          ],
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
