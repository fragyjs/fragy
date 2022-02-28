import { createApp } from 'vue';
import mitt from 'mitt';
import axios from 'axios';
import merge from 'lodash-es/merge';
import { createRouter } from './router';
import { createStore } from './store';
import { parseArticle } from './utils/article';
import { formatConfig } from './utils/config';
import consts from './constants';

const globalProperties = {};

globalProperties.$bus = mitt();
globalProperties.$http = axios;
globalProperties.$consts = consts;
globalProperties.$utils = {
  parseArticle,
};

const initialize = async () => {
  // import config
  // eslint-disable-next-line no-undef
  const { default: fragyConfig } = await import(__FRAGY_USER_CONFIG_PATH__);
  globalProperties.$fragy = formatConfig(fragyConfig);
  // import theme
  // eslint-disable-next-line no-undef
  const { default: theme } = await import(__FRAGY_THEME_PKG__);
  // eslint-disable-next-line no-undef
  const { default: themeConfig } = await import(__FRAGY_THEME_CONFIG_PATH__);
  const { config: userThemeConfig } = fragyConfig.theme;
  if (typeof userThemeConfig === 'object' && userThemeConfig) {
    merge(themeConfig, userThemeConfig);
  }
  globalProperties.$theme = themeConfig;

  // load theme entry
  // eslint-disable-next-line no-undef
  const { default: entry } = await import(__FRAGY_THEME_ENTRY_PATH__);

  // create vue app
  const app = createApp(entry);

  app.config.globalProperties = globalProperties;
  app.config.unwrapInjectedRef = true;

  // theme setup
  if (typeof theme.setup === 'function') {
    await Promise.resolve(theme.setup.call(null, app, fragyConfig, themeConfig));
  }

  // add router and store
  if (theme.routes) {
    const router = createRouter(theme.routes);
    app.use(router);
  }
  if (theme.store) {
    const store = createStore(theme.store);
    app.use(store);
  }

  // check markvue
  // eslint-disable-next-line no-undef
  if (__MARKVUE_ENABLED__) {
    const MarkVue = require('markvue').default;
    app.use(MarkVue);
  }

  // mount to dom
  app.mount('#app');
};

initialize();
