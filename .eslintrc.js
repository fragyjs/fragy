module.exports = {
  extends: ['alloy', 'alloy/vue', 'prettier'],
  env: {
    browser: true,
  },
  rules: {
    'vue/component-tags-order': 0,
    'vue/order-in-components': 0,
    'vue/component-definition-name-casing': 0,
  },
};
