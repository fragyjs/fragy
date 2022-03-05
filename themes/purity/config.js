// IMPORTANT: DO NOT DELETE ANY PROPERTY IN THE CONFIGURATION!!!
export default {
  color: {
    autoGenerate: true, // Generate and inject styles with specified color automatically
  },
  fontFamily: 'Noto Sans SC', // Main font for your site
  articleList: {
    prefetch: true, // Prefetch the article list before or after current page to improve user experience
    useJustifyAlign: true,
  },
  article: {
    title: '{articleTitle} - {siteTitle}',
    prefetch: true, // Prefetch contents of all article at current page to improve user experience
    useJustifyAlign: true,
  },
  footer: {
    enable: true,
    beian: {
      // China ISP record
      enable: false,
      text: '',
    },
    poweredby: {
      // Show powered by
      enable: true,
      github: false,
    },
    themeSwitcher: {
      // Show default / dark theme switcher
      enable: true,
    },
    license: {
      enable: false, // Show cc-by-4.0 icon
    },
  },
  valine: {
    enable: false,
    config: {}, // Configuration for valine
  },
  gfont: {
    enable: false,
    family: '',
    googleApisHost: '', // default: fonts.googleapis.com
    gstaticHost: '', // default: fonts.gstatic.com
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
