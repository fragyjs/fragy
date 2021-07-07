const path = require('path');
const webpack = require('webpack');

const SCRIPT_TEMPLATE = `<script src="{url}"></script>`;

module.exports = (context) => ({
  pages: {
    index: {
      entry: path.resolve(context.frameworkRoot, './src/main.js'),
      template: path.resolve(__dirname, './public/index.html'),
    },
  },
  chainWebpack: (config) => {
    const { vendors } = context.themeConfig;
    config.plugin('fragy-theme-flags').use(webpack.DefinePlugin, [
      {
        __HIGHLIGHT_JS__: JSON.stringify(vendors.highlightjs.main),
        __HIGHLIGHT_CSS_THEME__: JSON.stringify(vendors.highlightjs.theme),
        __HIGHLIGHT_CSS_THEME_DARK__: JSON.stringify(vendors.highlightjs.themeDark),
        __MARKED_JS__: JSON.stringify(vendors.marked),
        __VALINE_SCRIPT_LINE__: JSON.stringify(
          context.themeConfig.valine.enable ? SCRIPT_TEMPLATE.replace('{url}', vendors.valine) : '',
        ),
      },
    ]);
  },
});
