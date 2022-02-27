<template>
  <keep-alive>
    <ArticleList />
  </keep-alive>
</template>

<script>
import { defineComponent, getCurrentInstance, onBeforeMount } from 'vue';
import ArticleList from '../components/articles/ArticleList';

export default defineComponent({
  name: 'fragy.purity.page.index',
  components: {
    ArticleList,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    onBeforeMount(() => {
      document.title = proxy.$fragy.title;
    });
  },
});
</script>
