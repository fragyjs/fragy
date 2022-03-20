<template>
  <div class="page-wrapper">
    <div class="page">
      <NavBar />
      <div class="page-inner">
        <slot></slot>
      </div>
      <PageFooter />
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
      position: relative;
    }
  }
}
</style>
