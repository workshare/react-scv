'use strict';

const overrides = require('../src/overrides');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const {CWD, BUILD, PACKAGE, UMD_SRC_FILE, RULES_EXCLUDE, RULES_INCLUDE} = require('./constants');

const applyCoreConfig = require('./webpack.core');
const applyAssetsConfig = require('./webpack.assets');

module.exports = function (config, cursors) {

  config = applyCoreConfig(config, cursors);
  config = applyAssetsConfig(config, cursors, {inline: true});

  return merge(config, {
    devtool: 'source-map', //note: not working in conjunction with UglifyJsPlugin, see UglifyJsPlugin configuration below
    entry: [UMD_SRC_FILE],
    output: {
      path: path.join(BUILD, 'umd'),
      filename: 'umd.js',
      library: PACKAGE.name,
      libraryTarget: 'umd',
      umdNamedDefine: true
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
        })
      ]
    },
    externals: [nodeExternals()],
    plugins: [
      cursors.push('clean-webpack-plugin',
        new CleanWebpackPlugin([path.join(BUILD, 'umd')], {root: CWD})
      ),
      cursors.push('uglify-js-plugin',
        new webpack.optimize.UglifyJsPlugin({
          compress: {warnings: false},
          output: {comments: false},
          sourceMap: true //needed because of http://stackoverflow.com/questions/41942811/webpack-2-devtool-not-working
        })
      )
    ]
  });

}
