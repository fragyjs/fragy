<template>
  <div class="article">
    <div class="article-header">
      <div class="article-header__title" id="article-title">
        <span>{{ title }}</span>
      </div>
    </div>
    <div
      class="article-content"
      id="article-content"
      v-lazy-container="{ selector: 'img' }"
      v-html="renderedText"
    ></div>
  </div>
</template>

<script>
import marked from 'marked';
import pangu from 'pangu.simple';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/github.css';

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

export default {
  name: 'fragy.purity.article',
  props: {
    article: String,
  },
  data() {
    return {
      renderedText: '',
      content: ``,
    };
  },
  computed: {
    title() {
      return this.$route.params.name;
    },
  },
  mounted() {
    this.renderContent();
  },
  methods: {
    renderContent() {
      this.renderedText = marked(this.content, {
        highlight: (code) => {
          return hljs.highlightAuto(code).value;
        },
      });
      this.$nextTick(() => {
        pangu.spacingElementById('article-title');
        pangu.spacingElementById('article-content');
      });
    },
  },
};
</script>

<style lang="less">
.article {
  &-header {
    border-bottom: 0.0625rem dashed var(--article-border);
    padding-bottom: 1.5rem;
    &__title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--article-title);
    }
  }
  &-content {
    padding: 1.5rem 0;
    border-bottom: 0.0625rem dashed var(--article-border);
    text-align: justify;
    line-height: 2;
    p {
      color: var(--article-text);
      margin: 0 0 1.125rem 0;
    }
    a {
      color: var(--article-text);
    }
    a:hover {
      color: var(--article-link-hover) !important;
    }
    a:visited {
      color: var(--article-text);
    }
    h1,
    h2,
    h3,
    h4,
    h5 {
      color: var(--article-title);
      border-bottom: 0.0625rem solid var(--article-title-border);
    }
    h1 {
      font-size: 1.375rem;
    }
    h2 {
      font-size: 1.25rem;
    }
    h3 {
      font-size: 1.125rem;
    }
    h4 {
      font-size: 1.025rem;
    }
    h5 {
      font-size: 1rem;
    }
    img {
      display: block;
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
    }
    pre {
      background: var(--article-code-bg);
      padding: 0.75rem 1rem;
    }
  }
}
</style>
