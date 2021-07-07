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
import Page from './components/layout/Page';
import { computed } from '@vue/composition-api';
import { generateStyle } from './utils/theme';
import './utils/marked';

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
    if (typeof window.localStorage.getItem('fragy-purity-dark') === 'undefined') {
      const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (themeMedia.matches) {
        this.darkModeEnabled = true;
        this.colorThemeChanged('dark');
      }
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
      if (this.darkModeEnabled) {
        !document.documentElement.classList.contains('dark') &&
          document.documentElement.classList.add('dark');
        const linkEl = document.getElementById('hl-theme');
        linkEl.setAttribute('href', this.$theme.vendors.highlightjs.themeDark);
      } else {
        document.documentElement.classList.contains('dark') &&
          document.documentElement.classList.remove('dark');
        const linkEl = document.getElementById('hl-theme');
        linkEl.setAttribute('href', this.$theme.vendors.highlightjs.theme);
      }
      window.localStorage.setItem('fragy-purity-dark', this.darkModeEnabled);
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
