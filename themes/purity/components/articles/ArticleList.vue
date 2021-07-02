<template>
  <div class="article-list article-list-empty" v-if="showEmpty">
    <span v-if="listDataLoading">文章列表加载中...</span>
    <span v-if="loadFailed">文章列表加载失败</span>
    <span v-if="showDefaultEmptyText">这里暂时还没有文章...</span>
  </div>
  <div class="article-list" v-else>
    <div class="article-list__main">
      <ArticleBlock
        v-for="item in currentArticles"
        :key="item.title"
        :title="item.title"
        :abstract="item.abstract"
        :date="item.date"
        :filename="item.filename"
      />
    </div>
    <div class="article-list__footer">
      <Paginator
        :currentPage="currentPage"
        :pageCount="pageCount"
        @change="onPageChange"
        v-if="pageCount > 1"
      />
    </div>
  </div>
</template>

<script>
import ArticleBlock from './ArticleBlock';
import Paginator from '../layout/Paginator';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'fragy.purity.articles.list',
  components: {
    ArticleBlock,
    Paginator,
  },
  data() {
    return {
      currentPage: 1,
      total: 0,
      pageSize: this.$fragy.articleList.pageSize,
      articles: null,
      listDataLoadingStarted: true,
      listDataLoading: true,
      loadFailed: false,
      lastFetchTime: null,
      loadedPages: {},
    };
  },
  created() {
    this.fetchArticlesList();
  },
  computed: {
    ...mapGetters('article', ['cacheExisted']),
    feed() {
      return this.$fragy.articleList.splitPage
        ? `${this.$fragy.articleList.feed}/page-${this.currentPage}.json`
        : this.$fragy.articleList.feed;
    },
    showEmpty() {
      return this.listDataLoading || this.loadFailed || this.showDefaultEmptyText;
    },
    showDefaultEmptyText() {
      return (
        !this.listDataLoadingStarted &&
        !this.listDataLoading &&
        !this.loadFailed &&
        !this.currentArticles
      );
    },
    currentArticles() {
      if (!this.articles) {
        return null;
      }
      if (this.$fragy.articleList.splitPage) {
        return this.articles[this.currentPage];
      } else {
        const start = (this.currentPage - 1) * 10;
        const end = this.currentPage * 10;
        return this.articles.slice(start, end);
      }
    },
    pageCount() {
      if (this.$fragy.articleList.splitPage) {
        return Math.floor(this.total / this.pageSize) + 1;
      } else {
        return Math.floor(this.articles.length / this.pageSize) + 1;
      }
    },
  },
  methods: {
    ...mapMutations('article', ['setCache']),
    async fetchArticlesList() {
      if (this.loadedPages[this.currentPage]) {
        return;
      }
      // reset flags
      this.listDataLoadingStarted = true;
      const loadingTimeout = setTimeout(() => {
        this.listDataLoading = true;
      }, 500);
      this.loadFailed = false;
      // send request
      let res;
      try {
        res = await this.$http.get(this.feed);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article list info.', err);
        clearTimeout(loadingTimeout);
        this.listDataLoading = false;
        this.listDataLoadingStarted = false;
        this.loadFailed = true;
      }
      clearTimeout(loadingTimeout);
      this.listDataLoadingStarted = false;
      this.listDataLoading = false;
      if (res.data.total) {
        this.total = res.data.total;
      }
      this.loadedPages[this.currentPage] = true;
      if (this.$fragy.articleList.splitPage) {
        if (!this.articles) this.articles = {};
        this.$set(this.articles, this.currentPage, res.data.listData);
      } else {
        this.articles = res.data.listData;
      }
      this.lastFetchTime = Date.now();
      if (this.$theme.article.prefetch) {
        this.$nextTick(() => {
          this.prefetchAricles();
        });
      }
    },
    onPageChange(page) {
      this.currentPage = page;
      if (this.$fragy.articleList.splitPage) {
        this.fetchArticlesList();
      } else if (this.$theme.article.prefetch) {
        this.$nextTick(() => {
          this.prefetchAricles();
        });
      }
    },
    prefetchAricles() {
      if (!this.currentArticles) {
        return;
      }
      this.currentArticles.forEach(async (article) => {
        if (this.cacheExisted(article.filename)) {
          return;
        }
        const res = await this.$http.get(`${this.$fragy.articles.feed}/${article.filename}`);
        const parsedArticle = this.$utils.parseArticle(res.data.trim());
        this.setCache({
          filename: article.filename,
          article: parsedArticle,
        });
      });
    },
  },
};
</script>

<style lang="less">
.article-list-empty {
  user-select: none;
  span {
    color: var(--article-block-text);
  }
}
</style>
