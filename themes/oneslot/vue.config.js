const path = require('path');
const webpack = require('webpack');
const esmRequire = require('esm')(module);

const { generateColorStyles } = esmRequire('./utils/theme');

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
    const { gfont, colors, fontFamily } = context.themeConfig;
    config.plugin('oneslot-theme-flags').use(webpack.DefinePlugin, [
      {
        __GOOGLE_FONTS__: JSON.stringify(getGoogleFontsDefine(gfont)),
        __COLOR_STYLES__: JSON.stringify(`<style>${generateColorStyles(colors)}</style>`),
        __DEFAULT_FONTS__: JSON.stringify(getDefaultFont(fontFamily)),
      },
    ]);
  },
});
