<template>
  <div class="page-wrapper">
    <div class="page">
      <PageHeader />
      <div class="page-content">
        <slot></slot>
      </div>
      <PageFooter />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import PageHeader from './Header';
import PageFooter from './Footer';

export default defineComponent({
  name: 'fragy.purity.layout.page',
  components: {
    PageHeader,
    PageFooter,
  },
});
</script>

<style lang="less">
@main-width: 52rem;

.page-wrapper {
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
  box-sizing: border-box;
  position: relative;
  .page {
    width: 100%;
    max-width: @main-width;
    min-height: calc(100vh - 3rem);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    &-content {
      flex: 1 0 auto;
    }
  }
}
</style>
