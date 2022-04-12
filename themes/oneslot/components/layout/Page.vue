<template>
  <div class="page">
    <component :is="bgComponent" v-if="bgComponent" class="page-bg"></component>
    <nav-bar v-if="$route.meta.nav !== false" />
    <div class="page-content">
      <slot></slot>
    </div>
    <page-footer v-if="$route.meta.footer !== false" />
  </div>
</template>

<script>
import NavBar from './Nav.vue';
import PageFooter from './Footer.vue';

export default {
  components: {
    NavBar,
    PageFooter,
  },
  computed: {
    bgComponent() {
      if (!this.$theme.page?.bgComponent) {
        return null;
      }
      return this.$theme.page?.bgComponent;
    },
  },
};
</script>

<style lang="less">
.page {
  width: 100%;
  max-width: 67rem;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 1.5rem;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  .nav {
    flex-shrink: 0;
  }
  &-content {
    flex: 1;
  }
  .footer {
    flex-shrink: 0;
  }
  &-bg {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
  }
}
</style>
