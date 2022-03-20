const path = require('path');
const webpack = require('webpack');

module.exports = (context) => ({
  pages: {
    index: {
      entry: path.resolve(context.frameworkRoot, './src/main.js'),
      template: path.resolve(context.themeRoot, './public/index.html'),
      fileName: 'index.html',
    },
  },
  chainWebpack: (config) => {
    const { project, font } = context.themeConfig;
    config.plugin('orion-theme-flags').use(webpack.DefinePlugin, [
      {
        __PROJECT_NAME__: JSON.stringify(project?.name || 'Project Name'),
        __DEFAULT_FONT__:
          !font || font === 'Inter'
            ? JSON.stringify(
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/inter-latin.min.css" integrity="sha512-58RUR8XeD+WGgOn7uHg/D30JgCn0zcioRd0SPaKPTdsOYx+wi+4Nk9hNuecwfzwEog1STaBswJuYZBzjd34LUQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
              )
            : '',
      },
    ]);
  },
});
