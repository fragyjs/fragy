import Vue from 'vue';
import App from './App.vue';
import router from './router';
import config from '../fragy.config.js';
import VueLazyload from 'vue-lazyload';

Vue.config.productionTip = false;

Vue.prototype.$fragy = config;

const { theme } = config;
const themeConfig = require(`~themes/${theme}/config.js`).default;

Vue.prototype.$fragy.theme = themeConfig;

Vue.use(VueLazyload, {
  observer: true,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
