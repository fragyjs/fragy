<template>
  <div class="page">
    <Header />
    <div class="page-content">
      <slot></slot>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './Header';
import Footer from './Footer';

export default {
  name: 'fragy.purify.layout.page',
  components: {
    Header,
    Footer,
  },
};
</script>
