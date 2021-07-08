// IMPORTANT: DO NOT DELETE ANY PROPERTY IN THE CONFIGURATION!!!
export default {
  color: {
    autoGenerate: true,
  },
  articleList: {
    prefetch: true,
  },
  article: {
    title: '{articleTitle} - {siteTitle}',
    prefetch: true,
  },
  footer: {
    enable: true,
    beian: {
      enable: false,
      text: '',
    },
    poweredby: {
      enable: true,
      github: true,
    },
    themeSwitcher: {
      enable: true,
    },
  },
  valine: {
    enable: false,
  },
  vendors: {
    valine: 'https://cdn.bootcdn.net/ajax/libs/valine/1.4.9/Valine.min.js',
    marked: 'https://cdn.bootcdn.net/ajax/libs/marked/2.1.3/marked.min.js',
    highlightjs: {
      main: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.0.1/highlight.min.js',
      theme: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.0.1/styles/github.min.css',
      themeDark: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.0.1/styles/github-dark.min.css',
    },
  },
};
