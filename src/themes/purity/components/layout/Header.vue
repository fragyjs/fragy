<template>
  <div class="page-header">
    <div class="page-header-title">
      <span>{{title}}</span>
    </div>
    <div class="page-header-sub-title">
      <span>{{subtitle}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fragy.purify.layout.header',
  data() {
    const { title, subtitle } = this.$fragy;

    return {
      title,
      subtitle,
    };
  },
};
</script>

<style lang="less">
.page-header {
  &-title {
    background: var(--primary);
    color: var(--text-title);
  }
  &-subtitle {
    color: var(--text-subtitle);
  }
}
</style>
