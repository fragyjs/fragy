import Vue from 'vue';
import VueRouter from 'vue-router';

export const createRouter = (routes) => {
  Vue.use(VueRouter);
  return new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
  });
};
