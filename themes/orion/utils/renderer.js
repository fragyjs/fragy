import { marked } from 'marked';
import pangu from 'pangu.simple';

const renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  const escapedText = encodeURIComponent(text);
  return `
    <h${level}>
      ${pangu.spacing(text)}
      <a name="${escapedText}" class="article-heading-anchor" href="#${escapedText}" data-level="${level}">#</a>
    </h${level}>`.trim();
};

renderer.text = function (src) {
  return pangu.spacing(src);
};

renderer.link = function (href, title, text) {
  return `
  <a class="article-link" title="${title}" href="${href}" rel="external nofollow noopener noreferrer">${pangu.spacing(
    text,
  )}</a>
  `.trim();
};

renderer.image = function (href, title, text) {
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
};

export default renderer;
