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
      setCache(state, { filename, article }) {
        state.cache[filename] = article;
      },
    },
    getters: {
      getCachedContent: (state) => (filename) => {
        return state.cache[filename] || null;
      },
      cacheExisted: (state) => (filename) => {
        return !!state.cache[filename];
      },
    },
  },
};
