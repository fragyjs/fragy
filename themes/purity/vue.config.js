const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  pages: {
    index: {
      entry: path.resolve(__dirname, '../../src/main.js'),
      template: path.resolve(__dirname, './public/index.html'),
    },
  },
  chainWebpack: (config) => {
    config.plugin('hljs-css').use(CopyPlugin, [
      {
        patterns: [
          {
            from: path.resolve(__dirname, './node_modules/highlight.js/styles/github.css'),
            to: 'css',
          },
          {
            from: path.resolve(__dirname, './node_modules/highlight.js/styles/github-dark.css'),
            to: 'css',
          },
        ],
      },
    ]);
  },
};
