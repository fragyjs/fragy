const path = require('path');

const IS_IN_NODE_MODULES = path.resolve(__dirname).includes('node_modules');

const nodeModulesRoot = IS_IN_NODE_MODULES
  ? path.resolve(__dirname, '../../../')
  : path.resolve(__dirname, '../../node_modules');
const frameworkRoot = path.resolve(__dirname, '../../');
const userProjectRoot = IS_IN_NODE_MODULES ? path.resolve(frameworkRoot, '../../') : frameworkRoot;
const userDataRoot = path.resolve(userProjectRoot, './.fragy');

module.exports = {
  nodeModulesRoot,
  frameworkRoot,
  userProjectRoot,
  userDataRoot,
};
