'use strict';

const DefinePlugin = require('webpack').DefinePlugin;
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const merge = require('webpack-merge');

const {BUILD, CWD_NODE_MODULES, NODE_MODULES, RULES_EXCLUDE, RULES_INCLUDE} = require('./constants');

module.exports = function (config, cursors) {

  const ENV = Object
  .keys(process.env)
  .filter(key => key.toUpperCase().startsWith('NEO_'))
  .reduce((env, key) => {
    env[`process.env.${key}`] = JSON.stringify(process.env[key]);
    return env;
  }, {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  });

  return merge(config, {
    output: {
      path: BUILD,
      filename: 'bundle.js',
      publicPath: '/'
    },
    plugins: [
      cursors.push('define-plugin',
        new DefinePlugin(ENV)
      ),
      cursors.push('progress-bar-webpack-plugin',
        new ProgressBarWebpackPlugin({clear: false})
      )
    ],
    resolve: {
      modules: [NODE_MODULES, CWD_NODE_MODULES],
      extensions: ['.js', '.jsx', '.json']
    },
    resolveLoader: {
      modules: [NODE_MODULES, CWD_NODE_MODULES]
    },
    module: {
      rules: [
        cursors.push('source-map-rule', {
          test: /\.jsx?$/,
          include: RULES_INCLUDE,
          exclude: RULES_EXCLUDE,
          enforce: "pre",
          use: [
            {loader: 'source-map-loader'}
          ]
        }),
        cursors.push('style-rule', {
          test: /\.s?css$/, // alternative *** : ^(?:(?:[^\.\s]+\.)(?!module))+s?css$
          include: RULES_INCLUDE,
          exclude: RULES_EXCLUDE,
          use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
            {loader: 'sass-loader'},
          ]
        }),
        cursors.push('style-module-rule', {
          test: /\.s?cssm$/, // alternative *** : \.module\.s?css$
          include: RULES_INCLUDE,
          exclude: RULES_EXCLUDE,
          use: [
            {loader: 'style-loader'},
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]_[local]_[hash:base64:3]'
              }
            },
            {loader: 'resolve-url-loader'},
            {loader: 'sass-loader?sourceMap'}
          ]
        }),
        cursors.push('javascript-rule', {
          test: /\.jsx?$/,
          include: RULES_INCLUDE,
          exclude: RULES_EXCLUDE,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  ['@babel/preset-env', {"modules": false}], //{ "modules": false } is needed to make react-hot-loader work
                  '@babel/preset-stage-0',
                  '@babel/preset-react'
                ],
                plugins: [
                  'react-hot-loader/babel'
                ]
              }
            },
          ],
        })
      ]
    }
  });

}
