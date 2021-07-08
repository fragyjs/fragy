import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import axios from 'axios';
import { createRouter } from './router';
import { createStore } from './store';
import { parseArticle } from './utils/article';
import { formatConfig } from './utils/config';

// flags
// eslint-disable-next-line no-undef
const IS_IN_NODE_MODULES = __IS_IN_NODE_MODULES__;

Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue();
Vue.prototype.$http = axios;

Vue.prototype.$utils = {
  parseArticle,
};

Vue.use(VueCompositionAPI);

const initView = async () => {
  // import config
  const fragyConfigPath = IS_IN_NODE_MODULES ? '../../../fragy.config.js' : '../fragy.config.js';
  const fragyConfig = await import(fragyConfigPath).default;
  Vue.prototype.$fragy = formatConfig(fragyConfig);
  // import theme
  // eslint-disable-next-line no-undef
  const { default: theme } = await import(__FRAGY_THEME_PKG__);
  // eslint-disable-next-line no-undef
  const { default: themeConfig } = await import(__FRAGY_THEME_CONFIG_PATH__);
  const { config: userThemeConfig } = fragyConfig.theme;
  if (typeof userThemeConfig === 'object' && userThemeConfig) {
    Object.assign(themeConfig, userThemeConfig);
  }
  Vue.prototype.$theme = themeConfig;
  // theme setup
  if (typeof theme.setup === 'function') {
    await Promise.resolve(theme.setup.call(null, Vue, fragyConfig, themeConfig));
  }

  // eslint-disable-next-line no-undef
  const { default: entry } = await import(__FRAGY_THEME_ENTRY_PATH__);

  new Vue({
    router: createRouter(theme.routes),
    store: createStore(theme.store),
    render: (h) => h(entry),
  }).$mount('#app');
};

initView();
