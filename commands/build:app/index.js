'use strict';

const path = require('path');
const buildProductionDll = require('../../src/buildProductionDll');
const webpackBuild = require('../../src/webpackBuild');
const fs = require('fs');
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, 'package.json'));
const APP_BUILD_ENTRY = path.join(CWD, PACKAGE["react-scv"].appBuildEntry);
const middleware = require('../../src/middleware');

module.exports = (args, done) => {

  process.on('SIGINT', done);

  return buildProductionDllIfNotPresent()
  .then(buildApp)
  .then(done);

};

function buildApp () {
  if (fs.existsSync(APP_BUILD_ENTRY)) {
    console.log(' --- building the app --- ');
    const config = middleware.applyMiddleware(require.resolve('../../config/webpack.app'));
    return webpackBuild(config);
  }
}

function buildProductionDllIfNotPresent () {

  return new Promise((resolve, reject) => {

    console.log(' --- checking production dll existence --- ');

    if (!fs.existsSync(path.join(process.cwd(), 'build/app/app-dll-manifest.json')) || !fs.existsSync(path.join(process.cwd(), 'build/app/app-dll.js'))) {

      console.log('production dll not found');

      buildProductionDll().then(resolve).catch(reject);

    } else {
      console.log('production dll found, no need to build them again');
      resolve();
    }

  });

}
