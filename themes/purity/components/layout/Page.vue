<template>
  <div class="page-wrapper">
    <div class="page">
      <Header />
      <div class="page-content">
        <transition mode="out-in">
          <slot></slot>
        </transition>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from './Header';
import Footer from './Footer';

export default {
  name: 'fragy.purity.layout.page',
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="less">
@main-width: 52rem;

.page-wrapper {
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  margin: 0 auto;
  padding: 1.25rem;
  box-sizing: border-box;
  .page {
    width: 100%;
    max-width: @main-width;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    &-content {
      flex: 1 0 auto;
    }
  }
}

// transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 125ms;
}
.fade-enter,
.fade-leave {
  opacity: 0;
}
</style>
