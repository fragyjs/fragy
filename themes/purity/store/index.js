/* eslint-disable no-param-reassign */
export default {
  article: {
    namespaced: true,
    state: {
      title: null,
      cache: {},
    },
    mutations: {
      setTitle(state, title) {
        state.title = title;
      },
      setCache(state, { fileName, article }) {
        state.cache[fileName] = article;
      },
    },
    getters: {
      getCachedContent: (state) => (fileName) => {
        return state.cache[fileName] || null;
      },
      cacheExisted: (state) => (fileName) => {
        return !!state.cache[fileName];
      },
    },
  },
};
