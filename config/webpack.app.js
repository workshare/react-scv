'use strict';

const overrides = require('../src/overrides');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const {CWD, BUILD, PACKAGE, APP_SRC_FILE, RULES_EXCLUDE, RULES_INCLUDE} = require('./constants');

const applyCoreConfig = require('./webpack.core');
const applyAssetsConfig = require('./webpack.assets');

module.exports = function (config, cursors) {

  config = applyCoreConfig(config, cursors);
  config = applyAssetsConfig(config, cursors, {inline: false});

  return merge(config, {
    //devtool: 'source-map', //note: not working in conjunction with UglifyJsPlugin, see UglifyJsPlugin configuration below
    entry: [APP_SRC_FILE],
    output: {
      path: path.join(BUILD, 'app'),
      filename: 'app.js'
    },
    module: {
      rules: [
        cursors.push('eslint-rule', {
          test: /\.jsx?$/,
          enforce: "pre",
          include: RULES_INCLUDE,
          exclude: RULES_EXCLUDE,
          loader: 'eslint-loader',
          options: {
            configFile: overrides.filePath(path.join(__dirname, 'eslint.prod.js')),
            useEslintrc: false
          }
        }),
      ]
    },
    plugins: [
      cursors.push('clean-webpack-plugin',
        new CleanWebpackPlugin([path.join(BUILD, 'app')], {
          root: CWD,
          exclude: ['app-dll.js', 'app-dll-manifest.json'],
          verbose: true,
        })
      ),
      cursors.push('dll-reference-plugin',
        new webpack.DllReferencePlugin({
          context: '.',
          manifest: require(path.join(CWD, 'build/app/app-dll-manifest.json'))
        })
      ),
      cursors.push('uglify-js-plugin',
        new webpack.optimize.UglifyJsPlugin({
          compress: {warnings: false},
          output: {comments: false},
          include: RULES_INCLUDE,
          exclude: RULES_EXCLUDE,
          //sourceMap: true //needed because of http://stackoverflow.com/questions/41942811/webpack-2-devtool-not-working
        })
      ),
      cursors.push('html-webpack-plugin',
        new HtmlWebpackPlugin(merge({
          template: path.join(__dirname, '../src/template.ejs'),
          hash: true,
          xhtml: true
        }, PACKAGE["react-scv"].html || {}))
      ),
      cursors.push('add-asset-html-webpack-plugin',
        new AddAssetHtmlWebpackPlugin({
          filepath: path.join(CWD, 'build/app/app-dll.js'),
          includeSourcemap: false,
          hash: true,
        })
      ),
    ]
  });

}
