const { mergeWith } = require('lodash-es');

const customizer = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

export const merge = (a, b) => mergeWith(a, b, customizer);
