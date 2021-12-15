// IMPORTANT: DO NOT DELETE ANY PROPERTY IN THE CONFIGURATION!!!
export default {
  color: {
    autoGenerate: true,
  },
  fontFamily: 'Noto Sans SC',
  articleList: {
    prefetch: true,
    useJustifyAlign: true,
  },
  article: {
    title: '{articleTitle} - {siteTitle}',
    prefetch: true,
    useJustifyAlign: true,
  },
  footer: {
    enable: true,
    beian: {
      enable: false,
      text: '',
    },
    poweredby: {
      enable: true,
      github: false,
    },
    themeSwitcher: {
      enable: true,
    },
    // cc-by-4.0
    license: {
      enable: false,
    },
  },
  valine: {
    enable: false,
  },
  gfont: {
    enable: false,
    family: 'Noto+Sans+SC:wght@100;300;400;500;700;900',
  },
  vendors: {
    valine: 'https://cdnjs.cloudflare.com/ajax/libs/valine/1.4.16/Valine.min.js',
    marked: 'https://cdnjs.cloudflare.com/ajax/libs/marked/4.0.2/marked.min.js',
    highlightjs: {
      main: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js',
      theme: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/github.min.css',
      themeDark:
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/github-dark.min.css',
    },
  },
};
