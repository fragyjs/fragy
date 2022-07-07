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
  name: 'Landing',
  components: {
    BannerCard,
    ArticleList,
  },
});
</script>

<style lang="less" scoped>
.landing {
  width: 100%;
  position: relative;
}
</style>
