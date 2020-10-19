<template>
  <div class="article-list article-list-empty" v-if="showEmpty">
    <span>{{emptyText}}</span>
  </div>
  <div class="article-list" v-else></div>
</template>

<script>
export default {
  name: 'fragy.purify.articles.articleList',
  props: {
    articles: Array,
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
  },
};
</script>
