<template>
  <Page>
    <router-view></router-view>
  </Page>
</template>

<script>
import { defineComponent } from 'vue';
import Page from './components/layout/Page.vue';

export default defineComponent({
  components: {
    Page,
  },
});
</script>
