<template>
  <ArticleList />
</template>

<script>
import ArticleList from '../components/articles/ArticleList';

export default {
  name: 'fragy.purity.page.index',
  components: {
    ArticleList,
  },
  created() {
    document.title = this.$fragy.title;
  },
};
</script>
