<template>
  <Page>
    <router-view></router-view>
  </Page>
</template>

<script>
import { defineComponent } from 'vue';
import { lazyloadGoogleFonts } from 'lazyload-gfonts';
import Page from './components/layout/Page.vue';

export default defineComponent({
  components: {
    Page,
  },
  beforeCreate() {
    lazyloadGoogleFonts({
      fontFamily: this.$theme.gfont?.family || 'Noto+Sans+SC:wght@100;300;400;500;700;900',
      display: 'swap',
      apiHost: this.$theme.gfont?.googleApiHost,
    });
  },
});
</script>
