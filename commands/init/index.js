"use strict";

const Generator = require("yeoman-generator");
const path = require('path');
const version = require('../../package.json').version;

module.exports = class extends Generator {
  install() {
    this.installDependencies({
      bower: false,
      callback: () => {
        this.log("Pruning unused npm packages.\n");
        this.spawnCommandSync("npm", ["prune"]);
        this.log(
          "Done! You may wish to run `npm init` or make manual changes to your package.json."
        );
      }
    });
  }

  initializing() {
    console.log("initialize");
    this.spawnCommandSync("git", ["init", "--quiet"]);
  }

  prompting() {
    console.log("prompting");

    const done = this.async();
    const command = this.spawnCommand(
      "bash",
      ["-c", 'echo -n "$(npm config get init-author-name)"'],
      { stdio: "pipe" }
    );
    let name = "";

    command.stdout.on("data", data => (name += data));
    command.on("close", () => {
      const questions = [
        {
          name: "appTitle",
          message: "What is the title of your app?",
          default: "Project Name",
          store: true
        },
        {
          name: "packageName",
          message: "What is the name of your package (i.e. npm package name)?",
          default: path.basename(process.cwd()).replace(/\s/g, "-"),
          store: true
        },
        {
          name: "description",
          message: "Description",
          default: "A nifty React component",
          store: true
        },
        {
          name: "port",
          message: "Choose a port for development",
          default: 4000,
          store: true
        }
      ];

      this.prompt(questions).then(answers => {
        this.data = answers;
        this.data.version = version;
        done();
      });
    });
  }

  writing() {
    const copyDirs = ["src", "tests", ".circleci"];
    const copyFiles = [".gitignore", ".npmignore"];
    const copyTemplates = ["package.json", "README.md", "src/app.js"];

    copyDirs.forEach(dir => {
      this.fs.copy(this.templatePath(`${dir}/**/*`), this.destinationPath(dir));
    });

    copyFiles.forEach(file => {
      this.fs.copy(
        this.templatePath(file.startsWith(".") ? file.substr(1) : file),
        this.destinationPath(file)
      );
    });

    copyTemplates.forEach(template => {
      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(template),
        { data: this.data }
      );
    });
  }
};
