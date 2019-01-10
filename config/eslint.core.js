'use strict';

module.exports = {
  root: true,
  plugins: [
    'react'
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '16.7'
    },
    failOnWarning: false,
    failOnError: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      generators: true,
      impliedStrict: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'react/prop-types': [0]
  },
  globals: {
    process: true
  }
};
