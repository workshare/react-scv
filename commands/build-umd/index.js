'use strict';

const path = require('path');
const webpackBuild = require('../../src/webpackBuild');
const fs = require('fs');
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, 'package.json'));
const UMD_BUILD_ENTRY = path.join(CWD, PACKAGE["react-scv"].umdBuildEntry);
const middleware = require('../../src/middleware');
const chalk = require('chalk');

module.exports = (args, done) => {

  process.on('SIGINT', done);

  return buildUMD().then(done);

};

function buildUMD () {
  if (fs.existsSync(UMD_BUILD_ENTRY)) {
    console.log(chalk.magenta('■ ') + chalk.magenta('Building UMD') + chalk.magenta(' ■'));
    const config = middleware.applyMiddleware(require.resolve('../../config/webpack.umd'));
    return webpackBuild(config);
  }
}
