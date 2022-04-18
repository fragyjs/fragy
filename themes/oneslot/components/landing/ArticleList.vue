<template>
  <div class="article-list">
    <div class="article-list__title">Latest</div>
    <div class="article-list__content">
      <ArticleBlock v-for="meta in displayArticleList" :key="meta.title" :meta="meta" />
      <ScrollLoader @load="onLoadTriggered" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import ScrollLoader from '../common/ScrollLoader.vue';
import ArticleBlock from './ArticleBlock.vue';

export default defineComponent({
  name: 'ArticleList',
  components: {
    ScrollLoader,
    ArticleBlock,
  },
  data() {
    return {
      currentPage: 0,
      articles: {},
    };
  },
  computed: {
    isPageSplitted() {
      return this.$fragy.articleList.splitPage;
    },
    displayArticleList() {
      return Object.keys(this.articles).reduce((res, key) => {
        if (!Array.isArray(this.articles[key])) {
          return res;
        }
        return res.concat(this.articles[key]);
      }, []);
    },
  },
  methods: {
    getFeedUrl(page) {
      return this.$fragy.articleList.splitPage
        ? `${this.$fragy.articleList.feed}/page-${page}.json`
        : this.$fragy.articleList.feed;
    },
    async fetchArticleList(page) {
      let res;
      try {
        res = await this.$http.get(this.getFeedUrl(page));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to pre-fetch article list info.', err);
        throw err;
      }
      this.articles[page] = res.data.listData;
      return res;
    },
    async onLoadTriggered(e) {
      this.currentPage += 1;
      try {
        await this.fetchArticleList(this.currentPage);
      } catch (err) {
        this.currentPage -= 1;
        if (err.message.includes('Request failed with status code 404')) {
          e.noMore();
        }
      } finally {
        e.complete();
      }
    },
  },
});
</script>

<style lang="less" scoped>
.article-list {
  margin-top: 2rem;
  color: var(--text);
  &__title {
    font-size: 1rem;
    font-weight: 300;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
    box-sizing: border-box;
    user-select: none;
    opacity: 0.875;
  }
}
</style>
