import Vue from 'vue';
import Vuex from 'vuex';

export const createStore = (modules) => {
  Vue.use(Vuex);
  return new Vuex.Store({
    modules,
  });
};
