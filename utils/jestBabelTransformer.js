module.exports = require('babel-jest').createTransformer({
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-stage-0'),
    require.resolve('@babel/preset-react')
  ],
  sourceMaps: "inline"
});
