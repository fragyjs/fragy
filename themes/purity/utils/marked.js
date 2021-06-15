import marked from 'marked';
import hljs from 'highlight.js';

marked.use({
  renderer: {
    image: (href, title, text) => {
      const cleanedHref = decodeURIComponent(href);
      let out = `<img data-src="${cleanedHref}"`;
      if (text) {
        out += ` alt="${text}"`;
      }
      if (title) {
        out += ` title="${title}"`;
      }
      out += '/>';
      return out;
    },
  },
});

marked.setOptions({
  highlight: (code) => {
    return hljs.highlightAuto(code).value;
  },
});

export default marked;
