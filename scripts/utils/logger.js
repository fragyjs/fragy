/* eslint-disable no-console */
const moment = require('moment');
const chalk = require('chalk');

Object.defineProperty(moment, 'current', {
  get() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },
});

const logger = {
  debug(...content) {
    console.log(chalk.grey(`[${moment.current}]`, ...content));
  },
  info(...content) {
    console.log(chalk.green(`[${moment.current}]`, ...content));
  },
  warn(...content) {
    console.log(chalk.yellow(`[${moment.current}]`, ...content));
  },
  error(...content) {
    console.log(chalk.red(`[${moment.current}]`, ...content));
  },
};

module.exports = logger;
