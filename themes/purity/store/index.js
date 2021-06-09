/* eslint-disable no-param-reassign */
export default {
  article: {
    namespaced: true,
    store: {
      title: null,
    },
    mutations: {
      setTitle(state, title) {
        state.title = title;
      },
    },
  },
};
