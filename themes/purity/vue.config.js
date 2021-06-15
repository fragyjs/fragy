const path = require('path');

module.exports = {
  pages: {
    index: {
      entry: path.resolve(__dirname, '../../src/main.js'),
      template: path.resolve(__dirname, './public/index.html'),
    },
  },
};
