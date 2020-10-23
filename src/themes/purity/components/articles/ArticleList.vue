<template>
  <div class="article-list article-list-empty" v-if="showEmpty">
    <span>{{emptyText}}</span>
  </div>
  <div class="article-list" v-else>
    <ArticleBlock
      v-for="item in articles"
      :key="item.title"
      :title="item.title"
      :summary="item.summary"
      :time="item.time"
      :fullUrl="`//${host}/article/${item.title}`"
      />
  </div>
</template>

<script>
import ArticleBlock from './ArticleBlock';

export default {
  name: 'fragy.purify.articles.list',
  props: {
    articles: Array,
  },
  components: {
    ArticleBlock,
  },
  data() {
    const {
      articles: {
        emptyText,
      },
    } = this.$fragy.theme.config;

    return {
      emptyText,
    };
  },
  computed: {
    showEmpty() {
      const { articles } = this;
      return articles && Array.isArray(articles) && articles.length < 1;
    },
    host() {
      return window.location.host || '';
    },
  },
};
</script>
