const path = require('path');
const fs = require('fs');
const esm = require('esm');
const { userProjectRoot, frameworkRoot, nodeModulesRoot } = require('../utils/path');

const esmRequire = esm(module);

const { normalizeConfig } = esmRequire(path.resolve(frameworkRoot, './src/utils/config.js'));
const fragyConfig = normalizeConfig(
  esmRequire(path.resolve(userProjectRoot, './fragy.config.js')).default,
);

let themeConfig;

const themeConfigPath = path.resolve(nodeModulesRoot, `./${fragyConfig.theme.package}/config.js`);
if (fs.existsSync(themeConfigPath)) {
  themeConfig = esmRequire(themeConfigPath);
}

module.exports = {
  fragyConfig: Object.freeze(fragyConfig),
  themeConfig: Object.freeze(themeConfig || null),
};
