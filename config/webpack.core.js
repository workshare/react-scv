'use strict';
const DefinePlugin = require('webpack').DefinePlugin;
const ProgressBarWebpackPlugin = require('webpackbar');
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
        new ProgressBarWebpackPlugin()
      )
    ],
    resolve: {
      modules: [CWD_NODE_MODULES, NODE_MODULES],
      extensions: ['.js', '.jsx', '.json']
    },
    resolveLoader: {
      modules: [CWD_NODE_MODULES, NODE_MODULES]
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
          use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
            {loader: 'sass-loader'},
          ]
        }),
        cursors.push('style-module-rule', {
          test: /\.s?cssm$/, // alternative *** : \.module\.s?css$
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
                  '@babel/preset-react'
                ],
                plugins: [
                  'react-hot-loader/babel',

                  // https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/README.md
                  // Stage 0
                  "@babel/plugin-proposal-function-bind",

                  // Stage 1
                  "@babel/plugin-proposal-export-default-from",
                  "@babel/plugin-proposal-logical-assignment-operators",
                  ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
                  ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
                  ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
                  "@babel/plugin-proposal-do-expressions",
              
                  // Stage 2
                  ["@babel/plugin-proposal-decorators", { "legacy": true }],
                  "@babel/plugin-proposal-function-sent",
                  "@babel/plugin-proposal-export-namespace-from",
                  "@babel/plugin-proposal-numeric-separator",
                  "@babel/plugin-proposal-throw-expressions",
              
                  // Stage 3
                  "@babel/plugin-syntax-dynamic-import",
                  "@babel/plugin-syntax-import-meta",
                  ["@babel/plugin-proposal-class-properties", { "loose": false }],
                  "@babel/plugin-proposal-json-strings"
                ]
              }
            },
          ],
        })
      ]
    }
  });

}
