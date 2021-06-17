<template>
  <div class="article-list article-list-empty" v-if="showEmpty">
    <span v-if="articlesLoading">文章列表加载中...</span>
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
      pageSize: 10,
      articles: [],
      articlesLoading: true,
      loadFailed: false,
      feed: this.$fragy.articleList.feed,
    };
  },
  created() {
    this.fetchArticlesList();
  },
  computed: {
    ...mapGetters('article', ['cacheExisted']),
    showEmpty() {
      const { articles } = this;
      return articles && Array.isArray(articles) && articles.length < 1;
    },
    showDefaultEmptyText() {
      return !this.articlesLoading && !this.loadFailed;
    },
    currentArticles() {
      const start = (this.currentPage - 1) * 10;
      const end = this.currentPage * 10;
      return this.articles.slice(start, end);
    },
    pageCount() {
      return Math.floor(this.articles.length / this.pageSize) + 1;
    },
  },
  methods: {
    ...mapMutations('article', ['setCache']),
    async fetchArticlesList() {
      let res;
      try {
        res = await this.$http.get(this.feed);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article list info.', err);
        this.loadFailed = true;
      }
      this.articles = res.data;
      if (this.$theme.article.prefetch) {
        this.$nextTick(() => {
          this.prefetchAricles();
        });
      }
    },
    onPageChange(page) {
      this.currentPage = page;
      if (this.$theme.article.prefetch) {
        this.$nextTick(() => {
          this.prefetchAricles();
        });
      }
    },
    prefetchAricles() {
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
