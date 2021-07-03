// IMPORTANT: DO NOT DELETE ANY PROPERTY IN THE CONFIGURATION!!!
export default {
  color: {
    // primary: '#2e2e2e',
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
    appId: '',
    appKey: '',
  },
};
