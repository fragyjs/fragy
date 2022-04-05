<template>
  <Page>
    <router-view></router-view>
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
    // set rem fit
    this.fitScreen();
  },
  methods: {
    fitScreen() {
      const aspectRatio =
        document.documentElement.clientWidth / document.documentElement.clientHeight;
      let baseLine;
      if (aspectRatio <= 1920 / 1080) {
        baseLine = 1920;
      } else if (aspectRatio <= 2560 / 1080) {
        baseLine = 2560;
      } else if (aspectRatio <= 3840 / 1080) {
        baseLine = 3840;
      }
      if (document.documentElement.clientWidth >= baseLine) {
        const existed = document.querySelector('#orion-fit');
        const style = existed || document.createElement('style');
        if (!existed) {
          style.id = 'orion-fit';
        }
        style.innerHTML = `html { font-size: ${
          16 * (1 + (document.documentElement.clientWidth - baseLine) / baseLine)
        }px; }`;
        !existed && document.head.appendChild(style);
      }
    },
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
