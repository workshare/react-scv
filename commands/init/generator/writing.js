'use strict';

module.exports = function() {
  const copyDirs = ['src', 'tests', '.circleci'];
  const copyFiles = [
    '.gitignore',
    '.npmignore',
    '.eslintrc.js',
  ];
  const copyTemplates = [
    'package.json',
    'README.md',
    'src/app.js'
  ];

  copyDirs.forEach(dir => {
    this.fs.copy(this.templatePath(`${dir}/**/*`), this.destinationPath(dir));
  });

  copyFiles.forEach(file => {
    this.fs.copy(
      this.templatePath(file.startsWith('.') ? file.substr(1) : file),
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

};
