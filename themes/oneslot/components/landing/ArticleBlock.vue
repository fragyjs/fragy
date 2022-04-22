<template>
  <div class="article-block">
    <div class="article-block__meta">
      <div v-if="articleTags" class="article-block__tags">
        <span v-for="tag in articleTags" :key="tag" class="article-block__tag">{{ tag }}</span>
      </div>
      <div class="article-block__date">{{ articleDate }}</div>
    </div>
    <a :href="targetUrl" class="article-block__title" @click.prevent="toArticle">
      {{ articleTitle }}
    </a>
    <div ref="abstract" class="article-block__abstract" v-html="renderedAbstract"></div>
    <a :href="targetUrl" class="article-block__more" @click.prevent="toArticle">Read more...</a>
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
      return this.meta.date?.split(' ')[0];
    },
    articleTags() {
      const { filterType } = this.$theme;
      if (filterType === 'tags') {
        return this.meta.tags?.length ? this.meta.tags : null;
      } else {
        return this.meta.categories?.length ? this.meta.categories : null;
      }
    },
    targetUrl() {
      return `/article/${this.meta.fileName}`;
    },
    supportMarkVue() {
      return !!this.$fragy.markVue?.enable;
    },
  },
  created() {
    this.renderedAbstract = marked.parse(this.meta.abstract);
  },
  methods: {
    toArticle() {
      this.$router.push(this.targetUrl);
    },
  },
});
</script>

<style lang="less">
@import '../../styles/mixin/article.less';

.article-block {
  padding: 1.75rem 0 2.5rem 0;
  box-sizing: border-box;
  border-top: 1px solid var(--border);
  &__meta {
    user-select: none;
  }
  &__tags,
  &__date {
    font-size: 0.875rem;
    color: var(--text);
    opacity: 0.75;
    margin-bottom: 0.175rem;
  }
  &__tag::after {
    content: '·';
    margin: 0 0.125rem;
  }
  &__tag:last-child::after {
    display: none;
  }
  &__title {
    font-size: 1.625rem;
    font-weight: 600;
    color: var(--text-highlight);
    margin-top: 0.625rem;
    margin-bottom: 1.5rem;
    letter-spacing: 0.025rem;
    transition: opacity 100ms ease;
    display: block;
    text-decoration: none;
  }
  &__title:hover {
    opacity: 0.8;
    cursor: pointer;
  }
  &__abstract {
    .article-content-styles;
    vue-sfc {
      display: none;
    }
    vue-component {
      display: none;
    }
  }
  &__more {
    width: max-content;
    font-size: 0.875rem;
    color: var(--text);
    margin-top: 2rem;
    opacity: 0.75;
    cursor: pointer;
    display: block;
    letter-spacing: 0.05rem;
    text-decoration: none;
  }
  &__more:hover {
    opacity: 1;
  }
}
.article-block:first-child {
  border-top: none;
}
</style>
