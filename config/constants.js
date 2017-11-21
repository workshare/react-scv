const path = require('path');

const CWD = process.cwd();
const BUILD = path.join(CWD, 'build');
const CWD_NODE_MODULES = path.join(CWD, 'node_modules');
const NODE_MODULES = path.join(__dirname, '../node_modules');
const PACKAGE = require(path.join(CWD, 'package.json'));
const APP_SRC_FILE = path.join(CWD, PACKAGE["react-scv"].appBuildEntry);
const UMD_SRC_FILE = path.join(CWD, PACKAGE["react-scv"].umdBuildEntry);
const SRC_DIR = path.join(CWD, 'src');
const RULES_INCLUDE = [SRC_DIR];
const RULES_EXCLUDE = /(node_modules|bower_components)/;
const DEV_SERVER = PACKAGE["react-scv"].devServer || {};

module.exports = {
  CWD,
  BUILD,
  CWD_NODE_MODULES,
  NODE_MODULES,
  PACKAGE,
  APP_SRC_FILE,
  UMD_SRC_FILE,
  SRC_DIR,
  RULES_INCLUDE,
  RULES_EXCLUDE,
  DEV_SERVER
}
