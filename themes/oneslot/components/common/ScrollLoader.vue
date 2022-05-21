<template>
  <div ref="loader"
    :class="{
      'scroll-loader': true,
    }">
    <a-loading v-if="showLoadingComp" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      loading: false,
      showLoadingComp: false,
      noMore: false,
      timer: null,
      observer: new IntersectionObserver((entries) => {
        const entry = entries?.[0];
        if (entry?.intersectionRatio <= 0) {
          return;
        }
        if (this.loading) {
          return;
        }
        if (this.noMore) {
          this.observer.unobserve(this.$refs.loader);
          return;
        }
        this.loading = true;
        this.timer = setTimeout(() => {
          this.showLoadingComp = true;
        }, 1000);
        this.$emit('load', {
          complete: () => {
            this.loading = false;
            this.showLoadingComp = false;
            clearTimeout(this.timer);
          },
          noMore: () => {
            this.loading = false;
            this.noMore = true;
            clearTimeout(this.timer);
          },
        });
      }),
    };
  },
  mounted() {
    this.initLoader();
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
  methods: {
    initLoader() {
      if (!this.$refs.loader) {
        console.warn('Cannot find reference of scroll loader.');
        setTimeout(() => {
          this.initLoader();
        }, 100);
        return;
      }
      this.observer.observe(this.$refs.loader);
    },
  },
});
</script>

<style lang="less">
.scroll-loader {
  width: 100%;
  font-size: 10px;
  padding: 24px;
  box-sizing: border-box;
  opacity: 0.6;
  transition: all 200ms ease;
  .a-loading-wrapper {
    margin: 0 auto;
  }
}
</style>
