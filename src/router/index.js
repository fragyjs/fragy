import { createRouter as createVueRouter, createWebHistory } from 'vue-router';

export const createRouter = (routes) => {
  return createVueRouter({
    history: createWebHistory(),
    base: process.env.BASE_URL,
    routes,
  });
};
