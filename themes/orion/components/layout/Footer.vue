<template>
  <div v-if="showFooter" class="footer">
    <div v-if="license" class="footer-text footer-license">
      Released under the {{ license }} License.
    </div>
    <div v-if="author" class="footer-text footer-copyright">
      Copyright © {{ year }} {{ author }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      license: this.$theme.project?.license || '',
      author: this.$theme.project?.author || '',
    };
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    showFooter() {
      const checkKeys = ['license', 'author'];
      return checkKeys.reduce((res, curr) => {
        return res || !!this[curr];
      }, false);
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  &-text {
    width: 100%;
    text-align: center;
    line-height: 1.375rem;
    font-size: 0.75rem;
    color: var(--footer-text, #2e3430);
    opacity: 0.9;
  }
}
</style>
