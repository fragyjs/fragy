<template>
  <div ref="loader" class="scroll-loader"></div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      loading: false,
      noMore: false,
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
        this.$emit('load', {
          complete: () => {
            this.loading = false;
          },
          noMore: () => {
            this.noMore = true;
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
