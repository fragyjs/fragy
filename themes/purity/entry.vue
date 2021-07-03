<template>
  <div id="app">
    <Page>
      <div>
        <transition mode="out-in" name="fade">
          <router-view />
        </transition>
      </div>
    </Page>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api';
import Page from './components/layout/Page';
import { generateStyle } from './utils/theme';

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
    // set title
    document.title = this.$fragy.title;
    // listen events
    this.$bus.$on('color-theme-changed', this.colorThemeChanged);
    // check system theme
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (themeMedia.matches) {
      this.darkModeEnabled = true;
    }
    // generate theme
    if (this.$theme.color?.primary && this.$theme.color?.autoGenerate) {
      const style = generateStyle(this.$theme.color.primary);
      style && document.head.append(style);
    }
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
