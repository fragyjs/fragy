<template>
  <Page>
    <ArticleList />
  </Page>
</template>

<script>
import Page from '../components/layout/Page';
import ArticleList from '../components/articles/ArticleList';

export default {
  name: 'fragy.purity.page.index',
  components: {
    Page,
    ArticleList,
  },
};
</script>
