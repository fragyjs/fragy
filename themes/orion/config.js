export default {
  project: {
    name: 'Project Name',
  },
  nav: {
    icons: {
      github: true,
    },
  },
  colors: {
    light: {
      primary: '#83a473',
      secondary: '#93bc7f',
      bannerCardText: '#fff',
      bannerCardAction: '#fff',
      pageBackground: '#fdfdfd',
      textPrimary: '#223631',
      textSecondary: '#eff4f0',
      divider: 'rgba(0, 21, 5, 0.2)',
      codeBackground: 'rgb(37, 39, 33)',
      tagBackground: 'rgb(102, 108, 98)',
      menuBorder: 'rgba(0, 0, 0, 0.04)',
    },
  }, // define colors
  custom: {}, // define custom components
  vendors: {
    highlightjs: {
      main: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js',
      theme:
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/github-dark.min.css',
    },
  },
};
