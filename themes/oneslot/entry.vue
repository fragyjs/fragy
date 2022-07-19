<template>
  <Page>
    <router-view></router-view>
  </Page>
</template>

<script>
import { defineComponent } from 'vue';
import { lazyloadGoogleFonts } from 'lazyload-gfonts';
import { generateColorStyles } from './utils/theme';
import Page from './components/layout/Page.vue';

export default defineComponent({
  components: {
    Page,
  },
  beforeCreate() {
    // set colors
    const styleText = generateColorStyles(this.$theme.colors);
    const style = document.createElement('style');
    style.id = 'orion-custom';
    style.innerHTML = `${styleText}:root { --main-font: ${this.$theme.font || 'Inter'} }`;
    document.head.appendChild(style);
    lazyloadGoogleFonts({
      fontFamily: this.$theme.gfont?.family || 'Noto+Sans+SC:wght@100;300;400;500;700;900',
      display: 'swap',
      apiHost: this.$theme.gfont?.googleApiHost,
    });
  },
});
</script>
