<template>
  <div class="article-block">
    <div class="article-block__meta">
      <div v-if="articleTags" class="article-block__tags">
        <span v-for="tag in articleTags" :key="tag" class="article-block__tag">{{ tag }}</span>
      </div>
      <div class="article-block__date">{{ articleDate }}</div>
    </div>
    <div class="article-block__title">
      {{ articleTitle }}
    </div>
    <div ref="abstract" class="aritcle-block__abstract" v-html="renderedAbstract"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import marked from '../../utils/markdown';

export default defineComponent({
  name: 'ArticleBlock',
  props: {
    meta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      renderedAbstract: '',
    };
  },
  computed: {
    articleTitle() {
      return this.meta.title;
    },
    articleDate() {
      return this.meta.date;
    },
    articleTags() {
      const { filterType } = this.$theme;
      if (filterType === 'tags') {
        return this.meta.tags?.length ? this.meta.tags : null;
      } else {
        return this.meta.categories?.length ? this.meta.categories : null;
      }
    },
    supportMarkVue() {
      return !!this.$fragy.markVue?.enable;
    },
  },
  created() {
    this.renderedAbstract = marked.parse(this.meta.abstract);
  },
});
</script>
