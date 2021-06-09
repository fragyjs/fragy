import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import config from '../fragy.config.js';
import { parseArticle } from './utils/article';
import { formatConfig } from './utils/config';
import store from './store'

const { theme } = config;
const themeConfig = require(`~themes/${theme}/config.js`).default;

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

Vue.prototype.$fragy = formatConfig(config);
Vue.prototype.$fragy.theme = themeConfig;
Vue.prototype.$utils = {
  parseArticle,
};

Vue.use(VueLazyload, {
  observer: true,
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
