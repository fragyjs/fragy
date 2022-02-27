const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const copyPlugin = require('copy-webpack-plugin');
const esmRequire = require('esm')(module);

const IS_IN_NODE_MODULES = path.resolve(__dirname).includes('node_modules');

const nodeModulesPath = IS_IN_NODE_MODULES
  ? path.resolve(__dirname, '../')
  : path.resolve(__dirname, './node_modules');
const userProjectRoot = IS_IN_NODE_MODULES ? path.resolve(__dirname, '../../') : __dirname;
const userDataPath = IS_IN_NODE_MODULES
  ? path.resolve(userProjectRoot, './.fragy')
  : path.resolve(__dirname, './.fragy');
const userConfigPath = IS_IN_NODE_MODULES
  ? path.resolve(userProjectRoot, './fragy.config.js')
  : path.resolve(__dirname, './fragy.config.js');

// check user config path
if (!fs.existsSync(userConfigPath)) {
  throw new Error('Cannot locate user configuration (fragy.config.js), please check your project.');
}

const { formatConfig } = esmRequire('./src/utils/config');
const fragyConfig = formatConfig(esmRequire(userConfigPath).default);
const themeFuncs = {};
let themeVueConfig = null;

const themePkgInfoPath = path.resolve(
  nodeModulesPath,
  `./${fragyConfig.theme.package}/package.json`,
);

// check compatibility
let themePkgInfo;
if (fs.existsSync(themePkgInfoPath)) {
  themePkgInfo = JSON.parse(fs.readFileSync(themePkgInfoPath, { encoding: 'utf-8' }));
} else {
  throw new Error('Cannot find package.json of theme.');
}

if (themePkgInfo.compatibility) {
  if (
    typeof themePkgInfo.compatibility.github !== 'undefined' &&
    themePkgInfo.compatibility.github === false &&
    fragyConfig.github
  ) {
    throw new Error('The theme you used is not compatible with GitHub Mode.');
  }
}

const context = {
  frameworkRoot: __dirname,
  siteTitle: fragyConfig.title,
  themePkg: fragyConfig.theme.package,
  themeRoot: path.resolve(nodeModulesPath, `./${fragyConfig.theme.package}`),
  themeConfigPath: path.resolve(nodeModulesPath, `./${fragyConfig.theme.package}/config.js`),
  themeEntryPath: path.resolve(nodeModulesPath, `./${fragyConfig.theme.package}/entry.vue`),
  // config objs
  fragyConfig,
  themePkgInfo,
};

const themeConfig = esmRequire(context.themeConfigPath).default;
const userThemeConfig = fragyConfig.theme.config;
if (userThemeConfig) {
  Object.assign(themeConfig, userThemeConfig);
}
context.themeConfig = themeConfig;

const chainWebpack = (config) => {
  // theme flags
  config.plugin('fragy-flags').use(webpack.DefinePlugin, [
    {
      __FAVICON_URL__: JSON.stringify(fragyConfig.icon),
      __FRAGY_TITLE__: JSON.stringify(context.siteTitle),
      __FRAGY_LOCALE__: JSON.stringify(context.fragyConfig.locale),
      __FRAGY_THEME_PKG__: JSON.stringify(context.themePkg),
      __FRAGY_USER_CONFIG_PATH__: JSON.stringify(userConfigPath),
      __FRAGY_THEME_CONFIG_PATH__: JSON.stringify(context.themeConfigPath),
      __FRAGY_THEME_ENTRY_PATH__: JSON.stringify(context.themeEntryPath),
    },
  ]);

  // copy public files
  const publicPath = path.resolve(userDataPath, './public');
  if (fs.existsSync(publicPath)) {
    config.plugin('public-files').use(copyPlugin, [
      {
        patterns: [
          {
            from: publicPath,
          },
        ],
      },
    ]);
  }

  // copy posts and feed data
  if (fragyConfig.articles) {
    const { feed: articleFeed } = fragyConfig.articles;
    if (articleFeed && !/^https?\/\//.test(articleFeed)) {
      const articlesSource = `${path.resolve(userDataPath, './posts').replace(/\\/g, '/')}/**/*.md`;
      config.plugin('fragy-articles').use(copyPlugin, [
        {
          patterns: [
            {
              from: articlesSource,
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
              from: path.resolve(userDataPath, articleListPath),
              to: articleListFeed.substr(1),
            },
          ],
        },
      ]);
    }
  }

  config.optimization.splitChunks({
    cacheGroups: {
      theme: {
        name: 'theme',
        chunks: 'async',
        test: new RegExp(context.themePkg.replace(/\//g, '[\\\\/]')),
        priority: 20,
      },
      themeVendors: {
        name: 'theme-vendors',
        chunks: 'async',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
      },
      defaultVendors: {
        name: `chunk-vendors`,
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'initial',
      },
    },
  });

  // check theme entry override
  if (themeVueConfig?.pages?.index) {
    config.plugin('copy').tap((options) => {
      options[0].patterns[0].globOptions.ignore.push('**/index.html');
      return options;
    });
  }

  themeFuncs.chainWebpack?.(config);

  if (process.env.BUNDLE_ANALYZE === 'true') {
    config.plugin('bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  }
};

const configureWebpack = (config) => {
  themeFuncs.configureWebpack?.(config);
};

const vueConfig = {
  outputDir: IS_IN_NODE_MODULES ? path.resolve(userProjectRoot, './dist') : 'dist',
  productionSourceMap: false,
  chainWebpack,
  configureWebpack,
};

// merge theme vue.config.js
const themeFilePath = path.resolve(nodeModulesPath, `./${fragyConfig.theme.package}/vue.config.js`);

if (fs.existsSync(themeFilePath)) {
  let exported = require(themeFilePath);
  // if exported item is a function, get the return.
  if (typeof exported === 'function') {
    exported = exported(context);
  }
  themeVueConfig = exported;
  // merge webpack related functions
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
