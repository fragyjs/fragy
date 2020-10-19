const path = require('path');

const resolve = dir => path.join(__dirname, dir);

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('~themes', resolve('./src/themes'));
  },
};
