<template>
  <div class="article">
    <div class="article-title">
      <h1>{{title}}</h1>
    </div>
    <div class="article-content" v-html="markedText"></div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'fragy.common.article',
  props: {
    article: String,
  },
  data() {
    return {
      title: '',
      content: '',
    };
  },
  computed: {
    markedText() {
      return marked(this.content, {
        sanitize: true,
      });
    },
  },
};
</script>
