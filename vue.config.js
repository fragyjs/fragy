const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const copyPlugin = require('copy-webpack-plugin');
const esmRequire = require('esm')(module);

const { formatConfig } = esmRequire('./src/utils/config');
const fragyConfig = formatConfig(esmRequire('./fragy.config.js').default);
const themeFuncs = {};

const __data = path.resolve(__dirname, '.fragy');

const context = {
  siteTitle: fragyConfig.title,
  themePkg: fragyConfig.theme.package,
  themeConfigPath: path.resolve(__dirname, `./node_modules/${fragyConfig.theme.package}/config.js`),
  themeEntryPath: path.resolve(__dirname, `./node_modules/${fragyConfig.theme.package}/entry.vue`),
  // config objs
  fragyConfig,
};

const themeConfig = esmRequire(context.themeConfigPath).default;
const userThemeConfig = fragyConfig.theme.config;
if (userThemeConfig) {
  Object.assign(themeConfig, userThemeConfig);
}
context.themeConfig = themeConfig;

const chainWebpack = (config) => {
  config.plugin('theme-flags').use(webpack.DefinePlugin, [
    {
      __FRAGY__TITLE__: JSON.stringify(context.siteTitle),
      __FRAGY_THEME_PKG__: JSON.stringify(context.themePkg),
      __FRAGY_THEME_CONFIG_PATH__: JSON.stringify(context.themeConfigPath),
      __FRAGY_THEME_ENTRY_PATH__: JSON.stringify(context.themeEntryPath),
    },
  ]);

  const { feed: articleFeed } = fragyConfig.articles;
  if (articleFeed && !/^https?\/\//.test(articleFeed)) {
    config.plugin('fragy-articles').use(copyPlugin, [
      {
        patterns: [
          {
            from: '.fragy/posts/**/*.md',
            to: `${articleFeed.substr(1)}/[name].md`,
          },
        ],
      },
    ]);
  }

  const { output: articleListPath, feed: articleListFeed } = fragyConfig.articleList;
  if (articleListFeed && !/^https?\/\//.test(articleListFeed)) {
    config.plugin('fragy-article-list').use(copyPlugin, [
      {
        patterns: [
          {
            from: path.resolve(__data, articleListPath),
            to: articleListFeed.substr(1),
          },
        ],
      },
    ]);
  }

  config.optimization.splitChunks({
    cacheGroups: {
      theme: {
        name: 'theme',
        priority: 0,
        reuseExistingChunk: true,
        enforce: true,
      },
      themeVendors: {
        name: 'theme-vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: 20,
        reuseExistingChunk: true,
        enforce: true,
      },
      basic: {
        name: 'basic-vendors',
        test: /[\\/]node_modules[\\/]((@?vue)|(axios)|(babel))/,
        chunks: 'all',
        priority: 20,
        reuseExistingChunk: true,
        enforce: true,
      },
      vendors: {
        name: 'vendors',
        chunks: 'all',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        reuseExistingChunk: true,
        enforce: true,
      },
    },
  });

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
  let exported = require(themeFilePath);
  // if exported item is a function, get the return.
  if (typeof exported === 'function') {
    exported = exported.call(vueConfig, context);
  }
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
