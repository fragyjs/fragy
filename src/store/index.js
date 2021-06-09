import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const config = require('../../fragy.config.js').default;

const modules = require(`~themes/${config.theme}/store/index.js`).default;

export default new Vuex.Store({
  modules,
});
