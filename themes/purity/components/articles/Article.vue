<template>
  <div class="article">
    <div class="article-header">
      <div class="article-header-title" id="article-title">
        <span>{{ title }}</span>
      </div>
      <div class="article-header-meta" v-if="showMeta">
        <div class="article-header-meta__item" v-if="showDate">
          <Date /><span>{{ meta.date }}</span>
        </div>
      </div>
    </div>
    <div
      class="article-content"
      id="article-content"
      v-lazy-container="{ selector: 'img' }"
      v-html="renderedContent"
      v-if="showContent"
    ></div>
    <div class="article-content article-content-loading" v-if="contentLoading">
      <span>文章内容加载中...</span><i><Loading /></i>
    </div>
    <div class="article-content article-content-failed" v-if="loadFailed">
      <p>文章内容加载失败</p>
    </div>
  </div>
</template>

<script>
import pangu from 'pangu.simple';
import marked from '../../utils/marked';
import Date from '../icons/Date';
import Loading from '../icons/Loading';
import { mapState } from 'vuex';

export default {
  name: 'fragy.purity.article',
  props: {
    article: String,
  },
  components: {
    Date,
    Loading,
  },
  data() {
    return {
      meta: null,
      content: '',
      contentLoading: true,
      renderedContent: '',
      loadFailed: false,
    };
  },
  watch: {
    filename(newValue) {
      if (!newValue) {
        return;
      }
      this.meta = null;
      this.content = '';
      this.contentLoading = true;
      this.loadFailed = false;
      this.renderedContent = '';
      this.fetchArticle();
    },
  },
  async mounted() {
    await this.fetchArticle();
  },
  computed: {
    ...mapState({
      storedTitle: (state) => state.article.title,
    }),
    title() {
      let title;
      if (this.storedTitle) {
        title = this.storedTitle;
      } else if (this.meta?.title) {
        title = this.meta.title;
      } else {
        title = this.$route.params.name;
        if (title.endsWith('.md')) {
          title = title.substr(0, title.length - 3);
        }
      }
      return pangu.spacing(title);
    },
    filename() {
      if (!this.$route.path.includes('article')) {
        return '';
      }
      let filename = this.$route.params.name;
      if (!filename.endsWith('.md')) {
        filename = `${filename}.md`;
      }
      return filename;
    },
    showMeta() {
      return !!this.meta;
    },
    showDate() {
      return !!this.meta?.date;
    },
    showContent() {
      return !this.contentLoading && !this.loadFailed;
    },
  },
  methods: {
    async fetchArticle() {
      let res;
      try {
        res = await this.$http.get(`${this.$fragy.articles.base}/${this.filename}`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article content.', err);
        this.contentLoading = false;
        this.loadFailed = true;
        return;
      }
      const parsedArticle = this.$utils.parseArticle(res.data.trim());
      this.meta = parsedArticle.meta;
      this.content = parsedArticle.content.trim();
      this.contentLoading = false;
      this.renderContent();
    },
    renderContent() {
      this.renderedContent = marked(this.content);
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
    &-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--article-title);
    }
    &-meta {
      margin-top: 16px;
      &__item {
        display: flex;
        align-items: center;
        svg {
          width: 1.125rem;
          height: 1.125rem;
          margin-right: 8px;
          fill: var(--article-meta);
        }
        span {
          color: var(--article-meta);
          font-size: 0.875rem;
        }
      }
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
    p:last-child {
      margin: 0;
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
  &-content-loading {
    display: flex;
    align-items: center;
    i {
      display: flex;
      align-items: center;
      svg {
        width: 1.25rem;
        height: 1.25rem;
        fill: var(--primary);
        transform: translateY(-2px);
        margin-left: 10px;
        animation: rotate 1.125s ease-in-out infinite;
      }
    }
  }
}
</style>
