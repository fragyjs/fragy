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
import { computed } from '@vue/composition-api';
import Page from './components/layout/Page';
import Color from 'color';

const ColorTester = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/i;

export default {
  components: {
    Page,
  },
  data() {
    return {
      darkModeEnabled: window.localStorage.getItem('fragy-purity-dark') === 'true',
    };
  },
  provide() {
    return {
      darkModeEnabled: computed(() => this.darkModeEnabled),
    };
  },
  created() {
    const { primaryColor } = this.$theme;
    if (primaryColor && ColorTester.test(primaryColor)) {
      const color = new Color(primaryColor);
      const style = document.createElement('style');
      style.id = 'fragy-generated-styles';
      let lightenRate = 0.05;
      if (color.red() <= 50 && color.green() <= 50 && color.blue() <= 50) {
        lightenRate = 0.2;
      }
      const hoverColor = color.lighten(lightenRate).hex();
      const borderColor = color.lighten(lightenRate).hex();
      style.innerHTML = `:root {--primary:${primaryColor};--primary-hover:${hoverColor};--article-block-border:${borderColor};--article-border:${borderColor}};`;
      document.body.append(style);
    }
    document.title = this.$fragy.title;
    // listen events
    this.$bus.$on('color-theme-changed', this.colorThemeChanged);
  },
  methods: {
    colorThemeChanged(theme) {
      this.darkModeEnabled = theme === 'dark';
    },
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
