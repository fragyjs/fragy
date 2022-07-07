export default {
  colors: {
    default: {
      primary: '#636462',
      text: '#636462',
      textSecondary: '#d8d6d9',
      textHighlight: '#464843',
      link: '#828483',
      navText: '#929493',
      pageBackground: '#fafbfc',
      bannerBackground: '#d1d1d1',
      articleBackground: '#fdfdfd',
      codeBackground: 'rgba(36, 38, 39, 0.9)',
      codeBarBackground: 'rgba(62, 63, 66, 0.6)',
      tagBackground: 'rgba(92, 95, 93, 0.875)',
      shadow: 'rgba(16, 17, 15, 0.06)',
      textShadow: 'rgba(8, 12, 10, 0.08)',
      border: 'rgba(0, 0, 0, 0.06)',
    },
    dark: {
      pageBackground: '#232425',
    },
  },
  backToTop: true,
  filterType: 'category', // category or tags
  fontFamily: 'Noto Sans SC', // Main font family for your site
  footer: {
    copyright: {
      show: true,
      name: '{domain}',
    },
    poweredBy: true,
  },
  article: {
    title: '{articleTitle} - {siteTitle}',
  },
  gfont: {
    enable: true,
    family: 'Noto+Sans+SC:wght@100;300;400;500;700;900',
    googleApisHost: '', // default: fonts.googleapis.com
    gstaticHost: '', // default: fonts.gstatic.com
  },
  vendors: {
    highlightjs: {
      main: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js',
      theme:
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/github-dark.min.css',
    },
  },
};
