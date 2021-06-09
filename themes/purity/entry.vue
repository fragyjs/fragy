<template>
  <div id="app">
    <Page>
      <transition mode="out-in" name="fade">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
        <router-view v-else />
      </transition>
    </Page>
  </div>
</template>

<script>
import Page from './components/layout/Page';

export default {
  components: {
    Page,
  },
  created() {
    document.title = this.$fragy.title;
  },
};
</script>

<style lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 125ms;
}
.fade-enter,
.fade-leave {
  opacity: 0;
}
</style>
