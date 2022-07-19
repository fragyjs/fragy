/* eslint-disable no-console */
const moment = require('moment');
const chalk = require('chalk');

const now = () => moment().format('YYYY-MM-DD HH:mm:ss');

class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.logLevel = parseInt(process.env.LOG_LEVEL, 10) || 4;
  }
  debug(...content) {
    if (this.logLevel >= 4) console.log(chalk.grey(`[${now()}][${this.moduleName}]`, ...content));
  }
  info(...content) {
    if (this.logLevel >= 4) console.log(chalk.blue(`[${now()}][${this.moduleName}]`, ...content));
  }
  success(...content) {
    if (this.logLevel >= 3) console.log(chalk.green(`[${now()}][${this.moduleName}]`, ...content));
  }
  warn(...content) {
    if (this.logLevel >= 2) console.log(chalk.yellow(`[${now()}][${this.moduleName}]`, ...content));
  }
  error(...content) {
    if (this.logLevel >= 1) console.log(chalk.red(`[${now()}][${this.moduleName}]`, ...content));
  }
}

module.exports = Logger;
