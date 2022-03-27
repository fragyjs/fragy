import { marked } from 'marked';
import pangu from 'pangu.simple';

const renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `
    <h${level} class="article-title-nav" data-level="${level}">
      <a name="${escapedText}" class="anchor" href="#${escapedText}">
        <span class="header-link"></span>
      </a>
      ${pangu.spacing(text)}
    </h${level}>`.trim();
};
renderer.text = function (src) {
  return pangu.spacing(src);
};
renderer.link = function (href, title, text) {
  return `
  <a title="${title}" href="${href}" rel="external nofollow noopener noreferrer">${pangu.spacing(
    text,
  )}</a>
  `.trim();
};

export default renderer;
