import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const createStore = (modules) =>
  new Vuex.Store({
    modules,
  });
