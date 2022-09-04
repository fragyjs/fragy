// Inspired by https://github.com/IceApriler/html-webpack-code-inject-plugin

const HtmlWebpackPlugin = require('html-webpack-plugin');

const PluginName = 'inject-html-webpack-plugin';

class InjectHtmlWebpackPlugin {
  constructor(injections = {}) {
    this.injections = injections;
  }
  apply(compiler) {
    console.log('injections', this.injections);
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(PluginName, (html) => {
        if (Array.isArray(this.injections.headTags)) {
          html.headTags.push(...this.injections.headTags);
        }
        if (Array.isArray(this.injections.bodyTags)) {
          html.bodyTags.push(...this.injections.bodyTags);
          console.log(html.bodyTags);
        }
        return html;
      });
    });
  }
}

module.exports = InjectHtmlWebpackPlugin;
