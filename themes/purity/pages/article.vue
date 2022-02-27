<template>
  <FragyArticle />
</template>

<script>
import { defineComponent } from 'vue';
import FragyArticle from '../components/articles/Article';

export default defineComponent({
  name: 'fragy.purity.page.article',
  components: {
    FragyArticle,
  },
});
</script>
