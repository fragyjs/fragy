const mergeWith = require('lodash/mergeWith');

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

module.exports = (a, b) => mergeWith(a, b, customizer);
