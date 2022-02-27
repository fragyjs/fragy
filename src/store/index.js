import { createStore as createVuex } from 'vuex';

export const createStore = (modules) => {
  return createVuex({
    modules,
  });
};
