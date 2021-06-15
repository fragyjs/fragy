import Vue from 'vue';
import axios from 'axios';
import { createRouter } from './router';
import { createStore } from './store';
import { parseArticle } from './utils/article';
import { formatConfig } from './utils/config';
import fragyConfig from '../fragy.config.js';

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

Vue.prototype.$fragy = formatConfig(fragyConfig);
Vue.prototype.$utils = {
  parseArticle,
};

const initView = async () => {
  // import theme
  // eslint-disable-next-line no-undef
  const { default: theme } = await import(__FRAGY_THEME_PKG__);
  // eslint-disable-next-line no-undef
  const { default: themeConfig } = await import(__FRAGY_THEME_CONFIG__);
  if (fragyConfig.theme.config) {
    Object.assign(themeConfig, fragyConfig.theme.config);
  }
  Vue.prototype.$theme = themeConfig;
  // theme setup
  if (typeof theme.setup === 'function') {
    await Promise.resolve(theme.setup.call(null, Vue, fragyConfig, themeConfig));
  }

  // eslint-disable-next-line no-undef
  const { default: entry } = await import(__FRAGY_THEME_ENTRY__);

  new Vue({
    router: createRouter(theme.routes),
    store: createStore(theme.store),
    render: (h) => h(entry),
  }).$mount('#app');
};

initView();
