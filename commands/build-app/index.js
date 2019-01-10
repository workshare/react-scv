'use strict';

const path = require('path');
const webpackBuild = require('../../src/webpackBuild');
const fs = require('fs');
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, 'package.json'));
const APP_BUILD_ENTRY = path.join(CWD, PACKAGE["react-scv"].appBuildEntry);
const middleware = require('../../src/middleware');

module.exports = (args, done) => {

  process.on('SIGINT', done);

  return buildApp()
  .then(done);

};

function buildApp () {
  if (fs.existsSync(APP_BUILD_ENTRY)) {
    console.log(' --- building the app --- ');
    const config = middleware.applyMiddleware(require.resolve('../../config/webpack.app'));
    return webpackBuild(config);
  }
}
