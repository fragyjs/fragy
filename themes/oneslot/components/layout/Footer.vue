<template>
  <footer
    :class="{
      footer: true,
      'footer--article': isArticle,
      'footer--has-back2top': hasBackToTop,
    }"
  >
    <div v-if="showPoweredBy" class="footer-text footer-poweredby">
      Powered by <a :href="FRAGY_REPO_URL" target="_blank">Fragy</a> with theme
      <a :href="THEME_REPO_URL">OneSlot</a>
    </div>
    <div v-if="showCopyright" class="footer-text footer-copyright">
      Copyright © {{ year }} {{ copyright }}
    </div>
    <div v-if="customText" class="footer-text footer-custom">
      {{ customText }}
    </div>
  </footer>
</template>

<script>
import { defineComponent } from 'vue';

const FRAGY_REPO_URL = 'https://github.com/fragyjs/fragy';
const THEME_REPO_URL = 'https://github.com/fragyjs/fragy/tree/main/themes/oneslot';

export default defineComponent({
  data() {
    return {
      FRAGY_REPO_URL,
      THEME_REPO_URL,
    };
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    isArticle() {
      return this.$route.path?.startsWith('/article');
    },
    customText() {
      return this.$theme.footer?.customText;
    },
    showPoweredBy() {
      return this.$theme.footer?.poweredBy;
    },
    showCopyright() {
      return this.$theme.footer?.copyright?.show && this.copyright;
    },
    copyright() {
      const copyrightName = this.$theme.footer?.copyright?.name;
      return copyrightName.replace('{domain}', document.domain);
    },
    hasBackToTop() {
      return !!this.$theme.backToTop;
    },
  },
});
</script>

<style lang="less" scoped>
.footer {
  padding: 2.5rem 0 3.5rem 0;
  border-top: 1px solid var(--border);
  box-sizing: border-box;
  .footer-text {
    text-align: right;
    font-size: 0.75rem;
    color: var(--text);
    opacity: 0.75;
    line-height: 1.5rem;
    a {
      color: var(--text);
      opacity: 0.875;
      text-decoration: none;
    }
    a:hover {
      opacity: 1;
    }
  }
}

@media screen and (max-width: 1138px) {
  .footer--has-back2top {
    padding: 2.5rem 0 4rem 0;
  }
}
</style>
