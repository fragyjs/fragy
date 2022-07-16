const path = require('path');
const fs = require('fs');
const esm = require('esm');
const { userProjectRoot, frameworkRoot, nodeModulesRoot } = require('../utils/path');

const esmRequire = esm(module);

require('dotenv').config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV !== 'production' ? './.env.local' : './.env',
  ),
});

const { FRAGY_CONFIG: fragyConfigName } = process.env;
const configFileName = `fragy.config${fragyConfigName ? `.${fragyConfigName}` : ''}.js`;

const { normalizeConfig } = esmRequire(path.resolve(frameworkRoot, './src/utils/config.js'));
const fragyConfig = normalizeConfig(
  esmRequire(path.resolve(userProjectRoot, `./${configFileName}`)).default,
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
