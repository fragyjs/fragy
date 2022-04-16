<template>
  <div class="landing">
    <BannerCard />
    <ArticleList />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import BannerCard from '../components/landing/BannerCard.vue';
import ArticleList from '../components/landing/ArticleList.vue';

export default defineComponent({
  components: {
    BannerCard,
    ArticleList,
  },
});
</script>
