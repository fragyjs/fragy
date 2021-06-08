<template>
  <div class="page-header">
    <div class="page-header-title">
      <div class="page-header-title-main">
        <span>{{ title }}</span>
      </div>
      <div class="page-header-title-sub">
        <span>{{ subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fragy.purity.layout.header',
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
@header-height: 3rem;

.page-header {
  user-select: none;
  margin-bottom: 2.5rem;
  height: @header-height;
  flex: 0 0 auto;
  &-title {
    display: flex;
    &-main {
      min-width: 5rem;
      height: @header-height;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary);
      color: var(--text-title);
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: 0.075rem;
    }
    &-sub {
      color: var(--text-subtitle);
      align-self: flex-end;
      font-size: 1.125rem;
      letter-spacing: 0.05rem;
      margin-left: 1.25rem;
    }
  }
}
</style>
