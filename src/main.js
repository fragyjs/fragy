import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import axios from 'axios';
import router from './router';
import config from '../fragy.config.js';
import { parseArticle } from './utils/article';
import { formatConfig } from './utils/config';
import store from './store';

const { theme: themeName } = config;
const { setup: themeSetup } = require(`~themes/${themeName}/index.js`).default;
const themeConfig = require(`~themes/${themeName}/config.js`).default;

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

Vue.prototype.$fragy = formatConfig(config);
Vue.prototype.$fragy.themeConfig = themeConfig;
Vue.prototype.$utils = {
  parseArticle,
};

Vue.use(VueLazyload, {
  observer: true,
});

const initView = async () => {
  // theme setup
  if (typeof themeSetup === 'function') {
    await Promise.resolve(themeSetup.call(null, Vue, config, themeConfig));
  }

  const entry = require(`~themes/${themeName}/entry.vue`).default;

  new Vue({
    router,
    store,
    render: (h) => h(entry),
  }).$mount('#app');
};

initView();
