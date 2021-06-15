import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const createRouter = (routes) => {
  return new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
  });
};
