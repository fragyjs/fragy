import Vue from 'vue';
import VueRouter from 'vue-router';

const config = require('../../fragy.config.js').default;

const { routes } = require(`~themes/${config.theme}/index.js`).default;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
