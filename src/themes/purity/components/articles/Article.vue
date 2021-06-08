<template>
  <div class="article">
    <div class="article-title">
      <h1>{{ title }}</h1>
    </div>
    <div class="article-content" v-html="markedText"></div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'fragy.purity.article',
  props: {
    article: String,
  },
  data() {
    return {
      content: '',
    };
  },
  computed: {
    title() {
      return this.$route.params.name;
    },
    markedText() {
      return marked(this.content, {
        sanitize: true,
      });
    },
  },
};
</script>
