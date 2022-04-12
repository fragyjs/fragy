<template>
  <div class="landing">
    <BannerCard />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import BannerCard from '../components/landing/BannerCard.vue';

export default defineComponent({
  components: {
    BannerCard,
  },
});
</script>
