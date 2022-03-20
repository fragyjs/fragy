<template>
  <Page>
    <div>
      <router-view></router-view>
    </div>
  </Page>
</template>

<script>
import { defineComponent } from 'vue';
import { generateColorStyles } from './utils/theme';
import Page from './components/layout/Page';

export default defineComponent({
  components: {
    Page,
  },
  created() {
    // set title
    document.title = this.$theme.project?.name;
    // set colors
    const styleText = generateColorStyles(this.$theme.colors);
    const style = document.createElement('style');
    style.id = 'orion-custom';
    style.innerHTML = `${styleText}:root { --main-font: ${this.$theme.font || 'Inter'} }`;
    document.head.appendChild(style);
  },
});
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
