<template>
  <ArticleList :feed="this.$fragy.articleList.infoPath" />
</template>

<script>
import ArticleList from '../components/articles/ArticleList';

export default {
  name: 'fragy.purity.page.index',
  components: {
    ArticleList,
  },
};
</script>
