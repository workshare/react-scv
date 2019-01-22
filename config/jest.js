const path = require('path');
const CWD = process.cwd();
const CWD_NODE_MODULES = path.join(CWD, 'node_modules');
const NODE_MODULES = path.join(__dirname, '../node_modules');
const JEST_BABEL_TRANSFORMER = path.join(__dirname, '../utils/jestBabelTransformer.js');
const JEST_STYLE_MOCK = path.join(__dirname, '../utils/styleMock.js');
const JEST_FILE_MOCK = path.join(__dirname, '../utils/fileMock.js');
const ENZYME_SETUP = path.join(__dirname, 'enzyme.js');
const RAF_POLYFILL = require.resolve('raf/polyfill');
const BABEL_POLYFILL = require.resolve('@babel/polyfill')
const ROOT = path.join(CWD, 'tests');
const SRC = path.join(CWD, 'src');

/*
From Jest documentation:
rootDir [string]
Default: The root of the directory containing your jest's config file or the package.json or the pwd if no package.json is found

The root directory that Jest should scan for tests and modules within. If you put your Jest config inside your package.json and want the root directory to be the root of your repo, the value for this config param will default to the directory of the package.json.

Oftentimes, you'll want to set this to 'src' or 'lib', corresponding to where in your repository the code is stored.

roots [array]
Default: ["<rootDir>"]

A list of paths to directories that Jest should use to search for files in.

There are times where you only want Jest to search in a single sub-directory (such as cases where you have a src/ directory in your repo), but prevent it from accessing the rest of the repo.
*/


module.exports = {
  verbose: true,
  rootDir: CWD,
  roots: [SRC, ROOT],
  transform: {".*": JEST_BABEL_TRANSFORMER},
  collectCoverageFrom: ["src/**/*.(t|j)s?(x)", "!**/node_modules/**", "!**/vendor/**", "!src/**/*.d.ts"],
  testMatch: ['**/__tests__/**/*.(t|j)s?(x)', '**/?(*.)(spec|test).(t|j)s?(x)', '**/*+(_spec|_test).(t|j)s?(x)'],
  moduleDirectories: [CWD_NODE_MODULES, NODE_MODULES],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": JEST_FILE_MOCK,
    "\\.(css|less|scss)$": JEST_STYLE_MOCK,
    "\\.(cssm|scssm)$": "identity-obj-proxy"
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: [RAF_POLYFILL, ENZYME_SETUP, BABEL_POLYFILL],
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')]
}
