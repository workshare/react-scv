const babelPlugins = require('../config/babel.plugins');

module.exports = require('babel-jest').createTransformer({
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-react')
  ],
  sourceMaps: "inline",
  plugins: babelPlugins
});
