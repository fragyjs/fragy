const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const esmRequire = require('esm')(module);

const fragyConfig = esmRequire('./fragy.config.js').default;
const themeFuncs = {};

const chainWebpack = (config) => {
  config.plugin('theme-flags').use(webpack.DefinePlugin, [
    {
      __FRAGY_THEME_PKG__: JSON.stringify(fragyConfig.theme.package),
      __FRAGY_THEME_CONFIG__: JSON.stringify(
        path.resolve(__dirname, `./node_modules/${fragyConfig.theme.package}/config.js`),
      ),
      __FRAGY_THEME_ENTRY__: JSON.stringify(
        path.resolve(__dirname, `./node_modules/${fragyConfig.theme.package}/entry.vue`),
      ),
    },
  ]);
  if (process.env.BUNDLE_ANALYZE === 'true') {
    config.plugin('bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  }
  if (themeFuncs.chainWebpack) {
    themeFuncs.chainWebpack(config);
  }
};

const configureWebpack = (config) => {
  if (themeFuncs.configureWebpack) {
    themeFuncs.configureWebpack(config);
  }
};

const vueConfig = {
  chainWebpack,
  configureWebpack,
};

// merge theme vue.config.js
const themeFilePath = path.resolve(
  __dirname,
  `./node_modules/${fragyConfig.theme.package}/vue.config.js`,
);
if (fs.existsSync(themeFilePath)) {
  const exported = require(themeFilePath);
  if (exported.chainWebpack) {
    themeFuncs.chainWebpack = exported.chainWebpack;
  }
  if (exported.configureWebpack) {
    themeFuncs.configureWebpack = exported.configureWebpack;
  }
  // assign static properties
  const staticExported = JSON.parse(JSON.stringify(exported));
  Object.assign(vueConfig, staticExported);
}

module.exports = vueConfig;
