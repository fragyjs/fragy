import Vue from 'vue';
import App from './App.vue';
import router from './router';
import config from '../fragy.config.js';

Vue.config.productionTip = false;

Vue.prototype.$fragy = config;

const { theme } = config;
const themeConfig = require(`~themes/${theme}/config.js`).default;

Vue.prototype.$fragy.theme = themeConfig;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
