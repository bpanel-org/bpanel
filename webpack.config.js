const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

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
	    bcoin: path.resolve(__dirname, 'node_modules/bcoin/lib/bcoin-browser'),
	  },
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.(scss|css)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},
	plugins: [new UglifyJSPlugin({sourceMap: true})]
};
