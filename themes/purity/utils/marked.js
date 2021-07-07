(function() {
  window.marked.use({
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
  window.marked.setOptions({
    highlight: (code) => {
      return window.hljs.highlightAuto(code).value;
    },
  });
})();
