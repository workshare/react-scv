"use strict";

const DevServer = require("webpack-dev-server");
const path = require("path");
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, "package.json"));
const devServer = PACKAGE["react-scv"].devServer || {};
const port = devServer.port;
const flow = devServer.flow;
const FLOW_EXE = path.join(CWD, "node_modules/.bin/flow");
const FLOW_TARGET = path.join(CWD, "/node_modules/react-scv/config/");
const webpack = require("webpack");
const middleware = require("../../src/middleware");
const chalk = require("chalk");

module.exports = (args, done) => {
  if (!port) {
    throw new Error(
      "Please specify a port for the dev server in your package.json => src.devServer.port property"
    );
  }

  const config = middleware.applyMiddleware(
    require.resolve("../../config/webpack.dev")
  );

  const schema = config.devServer.https ? "https" : "http";
  const host = config.devServer.host || "localhost";

  config.entry.unshift(
    "react-hot-loader/patch",
    `webpack-dev-server/client?${schema}://${host}:${port}`,
    "webpack/hot/dev-server"
  );

  console.log(chalk.magenta("■ Starting dev server and API proxy ■"));

  const compiler = webpack(config);

  config.output.publicPath =
    schema + "://" + host + ":" + port + config.output.publicPath;

  const server = new DevServer(compiler, config.devServer);

  server.listen(port, host, () =>
    console.log(`Listening on ` + chalk.blue(`${schema}://${host}:${port}`))
  );

  process.on("SIGINT", () => {
    server.close();
    done();
  });
};
