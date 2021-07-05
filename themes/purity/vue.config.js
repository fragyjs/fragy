const path = require('path');
const webpack = require('webpack');

module.exports = (context) => ({
  pages: {
    index: {
      entry: path.resolve(context.projectRoot, './src/main.js'),
      template: path.resolve(__dirname, './public/index.html'),
    },
  },
  chainWebpack: (config) => {
    const { vendors } = context.themeConfig;
    config.plugin('theme-purity-vendors').use(webpack.DefinePlugin, [
      {
        __HIGHLIGHT_JS__: JSON.stringify(vendors.highlightjs.main),
        __HIGHLIGHT_CSS_THEME__: JSON.stringify(vendors.highlightjs.theme),
        __HIGHLIGHT_CSS_THEME_DARK__: JSON.stringify(vendors.highlightjs.themeDark),
        __VALINE_JS__: JSON.stringify(vendors.valine),
        __MARKED_JS__: JSON.stringify(vendors.marked),
      },
    ]);
  },
});
