<template>
  <div class="page">
    <component :is="bgComponent" v-if="bgComponent" class="page-bg"></component>
    <nav-bar v-if="$route.meta.nav !== false" />
    <div class="page-content">
      <slot></slot>
    </div>
    <page-footer v-if="$route.meta.footer !== false" />
    <back-to-top v-if="!!$route.meta.backToTop" />
  </div>
</template>

<script>
import NavBar from './Nav.vue';
import PageFooter from './Footer.vue';
import BackToTop from '../common/BackToTop.vue';

export default {
  components: {
    NavBar,
    PageFooter,
    BackToTop,
  },
  computed: {
    bgComponent() {
      return this.$theme.page?.bgComponent;
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100vw;
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
    width: 100%;
    flex-grow: 1;
    display: flex;
    position: relative;
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

@media screen and (max-width: 767px) {
  .page {
    padding: 0 1.5rem;
  }
}
</style>
