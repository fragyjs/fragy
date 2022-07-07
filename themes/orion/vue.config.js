const path = require('path');
const webpack = require('webpack');

module.exports = (context) => ({
  pages: {
    index: {
      entry: path.resolve(context.frameworkRoot, './src/main.js'),
      template: path.resolve(context.themeRoot, './public/index.html'),
      fileName: 'index.html',
    },
  },
  chainWebpack: (config) => {
    const { project, font, vendors } = context.themeConfig;
    config.plugin('orion-theme-flags').use(webpack.DefinePlugin, [
      {
        __PROJECT_NAME__: JSON.stringify(project?.name || 'Project Name'),
        __IMPORT_INTER_FONT__: JSON.stringify(!font || font === 'Inter'),
        __HIGHLIGHT_JS__: JSON.stringify(vendors.highlightjs.main),
        __HIGHLIGHT_CSS_THEME__: JSON.stringify(vendors.highlightjs.theme),
      },
    ]);
  },
});
