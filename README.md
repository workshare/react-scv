<p align="center">
  <img src="scv.jpeg" height="96" />
</p>

<p align="center">Create React modules with zero configuration needed</p>

## What is it about?

This library allows you to create "React modules" with zero configuration needed.

## What do you mean with "React modules"?

We mean a project that:

- Is a React "web application" that can be served statically on a server.
- Is also a "library" that can be imported by other projects as an npm dependency.

## How to create a new project?

```bash
mkdir -p <project-name>/node_modules && cd <project-name>
npm install react-scv
node_modules/.bin/react-scv init # and follow the prompts
```

Is important to notice that your new project doesn't contain any configuration file, it just works.

## What features I get for free in my new project?

- React
- Webpack
- Webpack proxy (useful to avoid CORS during development)
- react-hot-loader 3.0
- Babel with ES2015, Stage 0 and React presets
- Tests and coverage with Jest
- Enzyme
- Sass
- CSS modules (for files with extension .cssm or .scssm)
- ESLint
- Continuous Integration with circleCI

## How to work with my new project?

- Serve your web application on a devServer with hot-reload using `npm run start`, the entry point of your web application is `src/app.js`.
- Add your code in `src/` and `tests/`.
- Run your tests with `npm run test`.
- Do some ES6 exports in `src/module/index.js` to make the exported objects available to the users of your library.
- Distribute both the web application and the library running `npm run build`.

## Info about the build result

Running `npm run build` will produce

- A folder `build/app` containing your web application. Serve the content of this folder on a web server and enjoy your app in production.
- A folder `build/umd` containing the transpiled code of your library.

## What if I only care about the web application part of the build?

You can use `npm run build:app` instead of `npm run build`

## What if I only care about the library part of the build?

You can use `npm run build:umd` instead of `npm run build`

## Info about your new project contents

- `src/app.js` is used as entry point to serve and build your project as a web application, contents not included in this file will not be served by `npm run start` and will not be built by `npm run build`.
- `src/module/index.js` is used as entry point for the library produced by `npm run build`, contents not included in this file will not be part of the library.

The rest of the project should be self explanatory.

## Continuous Integration with circleCI:

React-scv provides some CI features for you, these features are implemented in `.circleci/config.yml`

### CI-1) Let circleCI run the tests for every push:

- Authorize circleCI to read from github repository: https://github.com/marketplace/circleci
- Add your project to circleCI: https://circleci.com/projects/gh/ORGANIZATION
    - When requested, choose Operating System `linux`, Platform `2.0`, Language `Node` and then click `Start building`

From now on circleCI will run the build and the tests on every push, you can check the status of the builds on https://circleci.com/dashboard

You can also add a badge displaying the status of the last build in your readme using the following snippet:

`[![CircleCI](https://circleci.com/gh/ORGANIZATION/PROJECT.svg?style=shield)](https://circleci.com/gh/ORGANIZATION/PROJECT)`

### CI-2) Let circleCI create/update the build on every push:

The content of the `build` folder is the one used when some project is importing yours as an npm dependency, therefore, it needs to be updated anytime you push new code to the repo.

We implemented a script allowing circleCI to create/update a tag containing the result of the build anytime you push new code, all you need to do is to grant permissions to circleCI so that it is able to push this tag on the repo for you.

You have many options to authorize circleCI to push new builds to github, details can be found here: https://circleci.com/gh/ORGANIZATION/PROJECT/edit#checkout

Once circleCI is authorized to push you can uncomment the `Release` section of your `.circleci/config.yml` and push it to github.

From now on circleCI will create/update a tag named `build-BRANCHNAME` (e.g `build-master`) for every push.

Think of the `build-BRANCHNAME` tag as an unstable release of your project, this tag will be always updated with your latest code.

This unstable release can be used by other projects to test your latest changes, all they need to do is to install the tag as an npm dependency e.g:

`npm install git+ssh://git@github.com/ORGANIZATION/PROJECT#build-master`

Please note that this tag should only be used for testing purposes, once your code is stable you can release a new version as described in the next section.

### CI-3) Let circleCI release a stable version of your library:

Once your code is stable you might want to release a stable version of your library.

To release a new version all you need to do is invoke the following api:

```
curl -X POST -H "Content-Type: application/json" -d '{
    "build_parameters": {
        "VERSION": "0.0.1"
    }
}' "https://circleci.com/api/v1.1/project/github/ORGANIZATION/PROJECT/tree/master?circle-token=TOKEN"
```

- You need an api token to invoke the api, the token can be created here: https://circleci.com/gh/ORGANIZATION/PROJECT/edit#api
- You need to configure the step CI-1 ans CI-2 in order for the release to work properly

Please note that is only possible to release the master branch of your project.

Releasing a stable version consists of creating a new tag named as the `VERSION` you specified in `build_parameters` (e.g 0.0.1) this tag contains the result of the build of your project.

This tag can be used by other projects to install your library, all they need to do is to install the tag as an npm dependency e.g:

`npm install --save git+ssh://git@github.com/ORGANIZATION/PROJECT#VERSION`

## Optional - Configuration, some basic stuff

A subset of the module features can be configured directly through the `react-scv` section in the package.json:

```javascript
"react-scv": {
  "appBuildEntry": "src/app.js", //the entry point of your web application
  "umdBuildEntry": "src/module/index.js", //the entry point of your library
  "html": { //doc here: https://github.com/jantimon/html-webpack-plugin#configuration
    "title": "the title of your app",
    "description": "the description of your app"
  },
  "devServer":{
    "port": "4000",
    "proxy": { //doc here: https://webpack.github.io/docs/webpack-dev-server.html#proxy
      "/api": { //proxies the api call to the /api path (useful to avoid CORS during development)
        "target": "https://anIP/aContextPath",
        "changeOrigin": true,
        "secure": false,
        "logLevel": "debug"
      }
    }
  }
}
```

## Optional - Customize react-scv in your project (if you want that extra feature so bad)

All the configuration files used by react-scv are at this path <a href="https://github.com/marcellomontemagno/react-scv/tree/master/config" target="_blank">here</a> before customizing something please take your time to have a look on what is there.

A subset of the configuration files can be extended/overridden, Here the files you can extend/override:

- `webpack.app.js` //used to build your web application during `build`
- `webpack.dev.js` //used to serve your application during `start`
- `webpack.umd.js` //used to build your library UMD during `build`
- `eslint.dev.js` //used to lint the code during `start`
- `eslint.prod.js` //used to lint the code during `build`
- `jest.js` //used to run the tests during `test`

### overriding/extending `webpack.app.js`, `webpack.dev.js` or `webpack.umd.js`

- create a file with the same name under `yourProjectRoot/react-scv/`
- the new file must export a function with this signature: `const newWebpackConfig = yourFunction(oldWebpackConfig, cursors);`

Here an example of how to add a new loader to `webpack.app.js`

```javascript
//this is the content of the file yourProjectRoot/react-scv/webpack.app.js

const WebpackVisualizerPlugin = require('webpack-visualizer-plugin');

module.exports = function(config){
    config.plugins.push(new WebpackVisualizerPlugin()); //modifies the webpack configuration object where needed
    return config;
};
```

We know that overriding webpack loaders and plugins can be difficult, for this reason we are providing [cursorify](https://github.com/marcellomontemagno/cursorify/) cursors as a second argument of the function you implement.
Here an example of how to override a loader using a [cursorify](https://github.com/marcellomontemagno/cursorify/) cursor:

```javascript
//this is the content of the file yourProjectRoot/react-scv/webpack.app.js

const setByCursor = require('cursorify').setByCursor;

module.exports = function (config, cursors) {

  const newSvgLoadingRule = {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loaders: [
      'svg-inline-loader', {
        loader: 'image-webpack-loader',
        options: {
          svgo: {
            plugins: [
              {
                removeStyleElement: true
              },
              {
                removeXMLNS: true
              },
              {
                removeDimensions: true
              }
            ]
          }
        }
      }
    ]
  }

  setByCursor(config, cursors['svg-rule'], newSvgLoadingRule); //overrides the existing rule using the cursor named 'svg-rule'

  return config;

};
```

### overriding/extending `jest.js`, `eslint.dev.js` or `eslint.prod.js`:

- create a file with the same name under `yourProjectRoot/react-scv/`
- the new file must export an object

here an example of how to change change a rule in `eslint.dev.js`

```javascript
//this is the content of the file yourProjectRoot/react-scv/eslint.dev.js
const deepmerge = require('deepmerge');
const config = require('react-scv/config/eslint.dev');
module.exports = deepmerge(config, {
  rules: {
    'no-console': 1
  }
});
```

## About overriding/extending:

When overriding something please keep in mind that

- you have to pay attention, we give you full freedom on what you can change, you are basically changing the react-scv code, this means, you might break something
- don't go crazy, you will need to maintain your customizations, migrating to a future version of react-scv might be difficult if you add too many features
- if you think <<oh maaaan, that extra feature I just added is sooo gooood>> you might help react-scv to include it in its the next release with a pull request instead of having a customization in your project 😊

## Info about browser globals and your UMD

When developing and running your module and with `npm run start` you will be able to access the globals presents in the 'babel-polyfill' and 'whatwg-fetch' npm modules (e.g window.fetch).
When you are distributing your UMD with `npm run build` the UMD will not contains 'babel-polyfill' and 'whatwg-fetch', so if you used any of these globals in your UMD code the environment where the UMD is running must provide them.
