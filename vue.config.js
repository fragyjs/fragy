const path = require('path');
const fs = require('fs');
const emptyDir = require('empty-dir');
const webpack = require('webpack');
const merge = require('lodash/merge');
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
const customElementIndex = path.resolve(userDataPath, './components/fragy.entry.js');

// check user config path
if (!fs.existsSync(userConfigPath)) {
  throw new Error('Cannot locate user configuration (fragy.config.js), please check your project.');
}

const { normalizeConfig } = esmRequire('./src/utils/config');
const fragyConfig = normalizeConfig(esmRequire(userConfigPath).default);
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
    throw new Error('The theme you are using now is not compatible with GitHub Mode.');
  }
}

const context = {
  frameworkRoot: __dirname,
  siteTitle: fragyConfig.title,
  themePkg: fragyConfig.theme.package,
  themeRoot: path.resolve(nodeModulesPath, `./${fragyConfig.theme.package}`),
  themeConfigPath: path.resolve(nodeModulesPath, `./${fragyConfig.theme.package}/config.js`),
  themeEntryPath: path.resolve(nodeModulesPath, `./${fragyConfig.theme.package}/entry.vue`),
  customComponentIndex: fs.existsSync(customElementIndex) ? customElementIndex : null,
  // config objs
  fragyConfig,
  themePkgInfo,
};

const themeConfig = esmRequire(context.themeConfigPath).default;
const userThemeConfig = fragyConfig.theme.config;
if (userThemeConfig) {
  merge(themeConfig, userThemeConfig);
}
context.themeConfig = themeConfig;

const chainWebpack = (config) => {
  // theme flags
  config.plugin('fragy-flags').use(webpack.DefinePlugin, [
    {
      __MARKVUE_ENABLED__: JSON.stringify(!!fragyConfig.markVue?.enable),
      __FAVICON_URL__: JSON.stringify(fragyConfig.icon || ''),
      __FRAGY_TITLE__: JSON.stringify(context.siteTitle || ''),
      __FRAGY_LOCALE__: JSON.stringify(context.fragyConfig.locale || ''),
      __FRAGY_THEME_PKG__: JSON.stringify(context.themePkg),
      __FRAGY_USER_CONFIG_PATH__: JSON.stringify(userConfigPath),
      __FRAGY_THEME_CONFIG_PATH__: JSON.stringify(context.themeConfigPath),
      __FRAGY_THEME_ENTRY_PATH__: JSON.stringify(context.themeEntryPath),
      __FRAGY_CUSTOM_COMPONENT_INDEX__: JSON.stringify(context.customComponentIndex),
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

  // copy posts
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
  }

  // copy feed data
  ['articleList', 'category', 'tag'].forEach((propertyName) => {
    if (!fragyConfig[propertyName]) {
      return;
    }
    const { output: sourcePath, feed: targetPath } = fragyConfig[propertyName];
    if (!sourcePath || /^https?\/\//.test(sourcePath)) {
      return;
    }
    const copySource = path.resolve(userDataPath, sourcePath);
    if (emptyDir.sync(copySource)) {
      return;
    }
    config.plugin(`fragy-feed-${propertyName}`).use(copyPlugin, [
      {
        patterns: [
          {
            from: copySource,
            to: targetPath.replace(/^\//, ''),
          },
        ],
      },
    ]);
  });

  // copy manifest data
  if (fragyConfig.category.manifestDetails || fragyConfig.tag.manifestDetails) {
    config.plugin('fragy-manifest').use(copyPlugin, [
      {
        patterns: [
          {
            from: path.resolve(userDataPath, './manifest'),
            to: 'data/manifest',
          },
        ],
      },
    ]);
  }

  const cacheGroups = {
    vendors: {
      name: `chunk-vendors`,
      test(module) {
        if (!module.resource) {
          return false;
        }
        const filtered = [
          'vue',
          '@vue',
          'vuex',
          '@vue/compiler-sfc',
          'marked',
          'markvue',
          'core-js',
          'axios',
          'yaml',
          'mitt',
          'lodash',
        ].reduce((res, curr) => {
          if (res) return res;
          return (
            res || module.resource.includes(`/${curr}`) || module.resource.includes(`\\${curr}`)
          );
        }, false);
        return /[\\/]node_modules[\\/]/.test(module.resource) && !filtered;
      },
      chunks: 'initial',
      priority: -5,
    },
    base: {
      name: 'chunk-base',
      chunks: 'initial',
      test(module) {
        if (!module.resource) {
          return false;
        }
        const included = [
          'vue',
          '@vue',
          'vuex',
          'marked',
          'core-js',
          'axios',
          'yaml',
          'mitt',
          'lodash',
        ].reduce((res, curr) => {
          if (res) return res;
          return (
            res || module.resource.includes(`/${curr}`) || module.resource.includes(`\\${curr}`)
          );
        }, false);
        return (
          /[\\/]node_modules[\\/]/.test(module.resource) &&
          !/[\\/]node_modules[\\/](@vue[\\/]compiler-sfc)|markvue/.test(module.resource) &&
          included
        );
      },
      priority: 20,
      enforce: true,
    },
    theme: {
      name: 'theme',
      chunks: 'async',
      test: new RegExp(context.themePkg.replace(/\//g, '[\\\\/]')),
      priority: 10,
    },
    themeVendors: {
      name: 'theme-vendors',
      chunks: 'async',
      test: /[\\/]node_modules[\\/]/,
      priority: 5,
      reuseExistingChunk: true,
    },
  };

  if (fragyConfig.markVue?.enable) {
    Object.assign(cacheGroups, {
      markVue: {
        name: 'chunk-markvue',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](markvue)|(@vue[\\/]compiler-sfc)/,
        priority: 30,
        enforce: true,
      },
    });
  }

  config.optimization.splitChunks({
    cacheGroups,
  });

  // check theme entry override
  if (themeVueConfig?.pages?.index) {
    config.plugin('copy').tap((options) => {
      options[0].patterns[0].globOptions.ignore.push('**/index.html');
      return options;
    });
  }

  const iconFormat = ['ico', 'png', 'jpg', 'jpeg', 'gif', 'webp'];
  const favIconPaths = iconFormat.map((ext) =>
    path.resolve(userDataPath, `./public/favicon.${ext}`),
  );
  const userFavIconExisted = favIconPaths.reduce((res, curr) => {
    if (res) return res;
    return res || fs.existsSync(curr);
  }, false);

  if (userFavIconExisted) {
    config.plugin('copy').tap((options) => {
      options[0].patterns[0].globOptions.ignore.push('**/favicon.ico');
      return options;
    });
  }

  themeFuncs.chainWebpack?.(config);

  if (process.env.BUNDLE_ANALYZE === 'true') {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    config.plugin('bundle-analyzer').use(
      new BundleAnalyzerPlugin({
        analyzerPort: 'auto',
      }),
    );
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
  integrity: fragyConfig.build.integrity,
  devServer: {
    port: 9090,
    server: 'https',
  },
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
