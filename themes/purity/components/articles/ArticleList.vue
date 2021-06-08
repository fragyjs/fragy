<template>
  <div class="article-list article-list-empty" v-if="showEmpty">
    <span>这里暂时还没有文章...</span>
  </div>
  <div class="article-list" v-else>
    <ArticleBlock
      v-for="item in currentArticles"
      :key="item.title"
      :title="item.title"
      :summary="item.summary"
      :time="item.time"
      :fullUrl="`//${host}/article/${item.title}`"
    />
    <Paginator :currentPage="currentPage" :pageCount="pageCount" @change="onPageChange" />
  </div>
</template>

<script>
import ArticleBlock from './ArticleBlock';
import Paginator from '../layout/Paginator';

export default {
  name: 'fragy.purity.articles.list',
  props: {
    articles: Array,
  },
  components: {
    ArticleBlock,
    Paginator,
  },
  inject: ['articles'],
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    showEmpty() {
      const { articles } = this;
      return articles && Array.isArray(articles) && articles.length < 1;
    },
    currentArticles() {
      const start = (this.currentPage - 1) * 10;
      const end = this.currentPage * 10;
      return this.articles.slice(start, end);
    },
    host() {
      return window.location.host || '';
    },
    pageCount() {
      return Math.floor(this.articles.length / this.pageSize) + 1;
    },
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page;
    },
  },
};
</script>
