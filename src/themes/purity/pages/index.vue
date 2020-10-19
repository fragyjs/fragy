<template>
  <Page>
    <ArticleList :articles="articles" />
  </Page>
</template>

<script>
import Page from '../components/layout/Page';
import ArticleList from '../components/articles/ArticleList';

export default {
  name: 'fragy.purify.page.index',
  components: {
    Page,
    ArticleList,
  },
  data() {
    return {
      articles: [],
    };
  },
};
</script>
