'use strict';

module.exports = {
  root: true,
  plugins: [
    'react',
    'react-hooks'
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '16.0'
    }
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
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      generators: true,
      impliedStrict: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'react/prop-types': [0],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  globals: {
    process: true
  }
};
