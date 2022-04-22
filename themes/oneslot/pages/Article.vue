<template>
  <div class="article">
    <div class="article-banner">
      <div class="article-banner-meta">
        <div v-if="articleTags" class="article-banner-meta__tags">
          <span v-for="tag in articleTags" :key="tag" class="article-banner-meta__tag">{{
            tag
          }}</span>
        </div>
        <div v-if="articleDate" class="article-banner-meta__date">
          {{ articleDate }}
        </div>
      </div>
    </div>
    <div class="article-title">
      {{ articleTitle }}
    </div>
    <div class="article-content">
      <MarkVue
        v-if="articleContent && supportMarkVue"
        id="article"
        v-lazy-container="{ selector: 'img' }"
        class="article-content__text"
        :content="content"
      />
      <div
        v-if="renderedContent && !supportMarkVue"
        id="article"
        v-lazy-container="{ selector: 'img' }"
        class="article-content__text"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import marked from '../utils/markdown';

const FAILED_FETCH_MESSAGE = 'Failed to fetch article content.';

export default defineComponent({
  name: 'OneSlotArticle',
  data() {
    return {
      meta: null,
      articleContent: '',
      renderedContent: '',
      contentLoading: false,
      contentLoadFailed: false,
    };
  },
  watch: {
    async fileName(newVal) {
      if (!newVal) {
        return;
      }
      // reset vars
      this.meta = null;
      this.articleContent = '';
      this.renderedContent = '';
      this.contentLoading = false;
      this.contentLoadFailed = false;
      // do the fetch
      await this.fetchArticle();
      this.setTitle();
      // reset scroll
      window.scrollTo({
        top: 0,
      });
    },
  },
  computed: {
    articleTitle() {
      return this.meta?.title;
    },
    articleTags() {
      const { filterType } = this.$theme;
      if (filterType === 'tags') {
        return this.meta?.tags?.length ? this.meta.tags : null;
      } else {
        return this.meta?.categories?.length ? this.meta.categories : null;
      }
    },
    articleDate() {
      return this.meta?.date || '';
    },
    supportMarkVue() {
      return !!this.$fragy.markVue?.enable;
    },
    fileName() {
      return this.$route.params.article;
    },
  },
  created() {
    this.fetchArticle();
  },
  methods: {
    async fetchArticle() {
      if (!this.fileName) {
        return;
      }
      let res;
      try {
        res = await this.$http.get(
          `${this.$fragy.articles.feed}/${encodeURIComponent(this.fileName)}`,
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(FAILED_FETCH_MESSAGE, err);
        this.contentLoading = false;
        this.contentLoadFailed = true;
        return;
      }
      if (res.status !== 200 || !res.data) {
        console.error(FAILED_FETCH_MESSAGE, res);
        this.contentLoading = false;
        this.contentLoadFailed = true;
        return;
      }
      this.renderArticle(res.data);
    },
    renderArticle(article) {
      if (!article) {
        this.contentLoadFailed = true;
        return;
      }
      const parsedArticle = this.$utils.parseArticle(article.trim());
      this.meta = parsedArticle.meta;
      this.articleContent = parsedArticle.content.trim();
      if (!this.supportMarkVue) {
        this.renderedContent = marked.parse(this.articleContent);
      }
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
@import '../styles/mixin/article.less';

.article {
  width: 100%;
  border-radius: 1.5rem;
  box-shadow: 3px 4px 18px var(--shadow);
  margin: 0.5rem 0 3.75rem 0;
  padding: 2rem 2.5rem;
  box-sizing: border-box;
  background: var(--article-background);
  &-banner {
    &-meta {
      user-select: none;
      &__tags,
      &__date {
        font-size: 0.875rem;
        color: var(--text);
        opacity: 0.75;
        margin-bottom: 0.175rem;
      }
      &__tag::after {
        content: '·';
        margin: 0 0.125rem;
      }
      &__tag:last-child::after {
        display: none;
      }
    }
  }
  &-title {
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--text-highlight);
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    letter-spacing: 0.0175rem;
    transition: opacity 100ms ease;
    display: block;
    text-decoration: none;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  &-content {
    padding-bottom: 2rem;
    box-sizing: border-box;
    &__text {
      .article-content-styles;
    }
  }
}
</style>
