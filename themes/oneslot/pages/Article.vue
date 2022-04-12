<template>
  <div class="article">
    <div class="article-banner">
      <div class="article-banner-meta">
        <div v-if="tags" class="article-banner-meta__tags"></div>
        <div v-if="date" class="article-banner-meta__date">
          {{ date }}
        </div>
      </div>
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
        class="aritcle-content__text"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

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
    tags() {
      if (!this.meta?.tags) {
        return [];
      }
      return Array.isArray(this.meta.tags) ? this.meta.tags : [this.meta.tags];
    },
    date() {
      return this.meta?.date || '';
    },
    supportMarkVue() {
      return !!this.$fragy.markVue?.enable;
    },
  },
  methods: {
    async fetchArticle() {
      let res;
      try {
        res = await this.$http.get(
          `${this.$fragy.articles.feed}/${encodeURIComponent(this.fileName)}`,
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(FAILED_FETCH_MESSAGE, err);
        this.contentLoading = false;
        this.loadFailed = true;
        return;
      }
      if (res.status !== 200 || !res.data) {
        console.error(FAILED_FETCH_MESSAGE, res);
        this.contentLoading = false;
        this.loadFailed = true;
        return;
      }
      this.parseArticle(res.data);
    },
    parseArticle() {},
    setTitle() {
      const template = this.$theme.article.title;
      document.title = template
        .replace('{articleTitle}', this.title)
        .replace('{siteTitle}', this.$fragy.title);
    },
  },
});
</script>
