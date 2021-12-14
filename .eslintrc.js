module.exports = {
  extends: ['alloy', 'alloy/vue', 'prettier'],
  rules: {
    'vue/component-tags-order': 0,
    'vue/order-in-components': 0,
    'vue/component-definition-name-casing': 0,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
};
