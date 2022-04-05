const path = require('path');
const webpack = require('webpack');

const SCRIPT_TEMPLATE = `<script src="{url}"></script>`;

const getGoogleFontsDefine = (gfontOptions) => {
  if (!gfontOptions.enable) {
    return '';
  }
  const googleApisHost = gfontOptions.googleApisHost || 'fonts.googleapis.com';
  const gstatciHost = gfontOptions.gstaticHost || 'fonts.gstatic.com';
  return `
  <link rel="preconnect" href="https://${googleApisHost}" crossorigin>
  <link rel="preconnect" href="https://${gstatciHost}" crossorigin>
  <link href="https://${googleApisHost}/css2?family=${gfontOptions.family}&display=swap" rel="stylesheet">
  `.trim();
};

const getDefaultFont = (fontFamily) => {
  if (!fontFamily) {
    return '';
  }
  return `
  <style>
    :root {
      --main-font: ${fontFamily};
    }
  </style>
  `.trim();
};

module.exports = (context) => ({
  pages: {
    index: {
      entry: path.resolve(context.frameworkRoot, './src/main.js'),
      template: path.resolve(context.themeRoot, './public/index.html'),
      fileName: 'index.html',
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
        __GOOGLE_FONTS__: JSON.stringify(getGoogleFontsDefine(context.themeConfig.gfont)),
        __DEFAULT_FONTS__: JSON.stringify(getDefaultFont(context.themeConfig.fontFamily)),
      },
    ]);
  },
});
