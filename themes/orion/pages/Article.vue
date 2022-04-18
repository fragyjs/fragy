<template>
  <a-layout class="article">
    <a-side class="article-menu-wrapper" width="16.5rem">
      <ArticleMenu ref="menu" :menu="menu" />
    </a-side>
    <a-layout class="article-main">
      <a-content>
        <MarkVue
          v-if="articleContent && supportMarkVue"
          id="article"
          v-lazy-container="{ selector: 'img' }"
          class="article-content"
          :content="articleContent"
          :markedOptions="markedOptions"
        ></MarkVue>
        <div
          v-if="articleContent && !supportMarkVue"
          id="article"
          v-lazy-container="{ selector: 'img' }"
          class="article-content"
          v-html="renderedContent"
        ></div>
        <div v-if="!articleContent" class="article--no-content">
          <span>loading</span>
        </div>
      </a-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { marked } from 'marked';
import { getArticleMenu } from '../utils/article';
import Renderer from '../utils/renderer';
import Menu from '../components/article/Menu.vue';

export default defineComponent({
  components: {
    ArticleMenu: Menu,
  },
  data() {
    return {
      menu: [],
      meta: null,
      articleContent: '',
      renderedContent: '',
      loading: false,
      loadFailed: false,
      notFound: false,
      markedOptions: {
        renderer: Renderer,
        highlight: (code) => {
          return window.hljs?.highlightAuto(code).value;
        },
      },
    };
  },
  watch: {
    async fileName(newValue) {
      if (!newValue) {
        return;
      }
      this.meta = null;
      this.menu = [];
      this.articleContent = '';
      this.renderedContent = '';
      this.loading = true;
      this.loadFailed = false;
      await this.fetchArticle();
      this.setTitle();
      window.scrollTo({
        top: 0,
      });
    },
  },
  computed: {
    fileName() {
      let { article: fileName } = this.$route.params;
      if (!fileName) {
        return;
      }
      if (!fileName.endsWith('.md')) {
        fileName = `${fileName}.md`;
      }
      return fileName;
    },
    supportMarkVue() {
      return !!this.$fragy.markVue?.enable;
    },
  },
  created() {
    this.fetchArticle();
  },
  methods: {
    async fetchArticle() {
      let res;
      try {
        this.loading = true;
        res = await this.$http.get(
          `${this.$fragy.articles.feed}/${encodeURIComponent(this.fileName)}`,
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article content.', err);
        this.loadFailed = true;
        return;
      } finally {
        this.loading = false;
      }
      if (res.status !== 200 || !res.data) {
        if (res.status === 404) {
          this.notFound = true;
        } else {
          this.loadFailed = true;
        }
      }
      this.renderArticle(res.data);
    },
    renderArticle(article) {
      if (!article) {
        this.loadFailed = true;
        return;
      }
      const parsedArticle = this.$utils.parseArticle(article.trim());
      this.meta = parsedArticle.meta;
      this.articleContent = parsedArticle.content.trim();
      if (!this.supportMarkVue) {
        this.renderedContent = marked.parse(this.articleContent, this.markedOptions);
      }
      this.$nextTick(() => {
        this.menu = getArticleMenu('article');
      });
    },
    setTitle() {
      const template = this.$theme.article.title;
      document.title = template
        .replace('{articleTitle}', this.title)
        .replace('{siteTitle}', this.$fragy.title);
    },
  },
});
</script>

<style lang="less">
.article {
  &-menu-wrapper {
    position: fixed !important;
    bottom: 0;
    left: 0;
    height: calc(100vh - var(--nav-height));
    box-shadow: 0.125rem 0 0.125rem rgba(0, 0, 0, 0.01);
    z-index: 10;
  }
  &-main {
    padding-left: 16.5rem;
    box-sizing: border-box;
    width: 100%;
    z-index: 2;
  }
  &-content {
    max-width: 100rem;
    margin: 0 auto;
    padding: var(--nav-height) 9rem 5rem 7.5rem;
    box-sizing: border-box;
    h1,
    h2,
    h3,
    h4,
    h5 {
      a {
        float: left;
        margin-left: -0.925em;
        margin-top: 0.115em;
        opacity: 0;
        text-decoration: none;
        transition: opacity 100ms ease;
        color: var(--primary);
      }
      a:hover {
        opacity: 1;
      }
    }
    h1:hover,
    h2:hover,
    h3:hover,
    h4:hover,
    h5:hover {
      a {
        opacity: 0.8;
      }
    }
    h1 {
      margin-top: 0;
      margin-bottom: 2.5rem;
      font-weight: 700;
      font-family: var(--main-font);
      color: var(--text-primary);
      letter-spacing: 0.05rem;
      text-decoration: none;
    }
    h2 {
      margin: 4rem 0 1.75rem;
      border-top: 1px solid var(--divider);
      padding-top: 2rem;
      font-size: 1.5rem;
      letter-spacing: 0.0375rem;
      color: var(--text-primary);
      text-decoration: none;
    }
    h3 {
      margin: 3.25rem 0 1.75rem;
      font-size: 1.25rem;
      letter-spacing: 0.0375rem;
      color: var(--text-primary);
      text-decoration: none;
    }
    h4,
    h5 {
      margin: 2.75rem 0 1.5rem;
      color: var(--text-primary);
      text-decoration: none;
    }
    p {
      margin: 0 0 1.25rem 0;
      color: var(--text-primary);
      line-height: 2rem;
      code {
        background: var(--tag-background);
        color: var(--text-secondary);
        padding: 0.1rem 0.375rem;
        border-radius: 0.25rem;
        margin: 0 0.125rem;
        box-sizing: border-box;
      }
      a {
        color: var(--primary);
        text-decoration: none;
        transition: opacity 100ms ease;
      }
      a:hover {
        opacity: 0.8;
      }
    }
    pre {
      margin: 0 0 1.5rem 0;
      overflow-x: auto;
      padding: 1.5rem 1.875rem;
      border-radius: 1rem;
      background: var(--code-background);
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5rem;
    }
    li {
      line-height: 2.5rem;
      color: var(--text-primary);
      code {
        background: var(--tag-background);
        color: var(--text-secondary);
        padding: 0.1rem 0.375rem;
        border-radius: 0.25rem;
        margin: 0 0.125rem;
        box-sizing: border-box;
      }
    }
  }
}
</style>
