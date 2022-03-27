<template>
  <div class="page-wrapper">
    <div class="page">
      <NavBar />
      <div class="page-inner">
        <slot></slot>
      </div>
      <PageFooter v-if="showFooter" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import NavBar from './NavBar.vue';
import PageFooter from './Footer.vue';

export default defineComponent({
  name: 'OrionPage',
  components: {
    NavBar,
    PageFooter,
  },
  computed: {
    showFooter() {
      return this.$route.meta?.noFooter !== true;
    },
  },
});
</script>

<style lang="less" scoped>
.page-wrapper {
  .page {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    &-inner {
      flex: 1;
      padding-top: 3.5rem;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
    }
  }
}
</style>
