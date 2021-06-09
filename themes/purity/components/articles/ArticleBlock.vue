<template>
  <div class="article-block">
    <div class="article-block-title">
      <a :href="fullUrl" @click.prevent="toArticlePage">{{ displayTitle }}</a>
    </div>
    <div class="article-block-abstract" ref="abstract" v-html="renderedAbstract"></div>
    <div class="article-block-footer">
      <div class="article-block-footer-time">
        <Date />
        <span>{{ date }}</span>
      </div>
      <div class="article-block-footer-controls">
        <a :href="fullUrl" class="button-read-all" @click.prevent="toArticlePage">阅读全文</a>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '../icons/Date';
import marked from '../../utils/marked';
import pangu from 'pangu.simple';

export default {
  name: 'fragy.purity.articles.block',
  props: {
    title: String,
    abstract: String,
    date: String,
    filename: String,
  },
  components: {
    Date,
  },
  data() {
    return {
      renderedAbstract: '',
    };
  },
  mounted() {
    this.renderAbstract();
    this.$nextTick(() => {
      pangu.spacingNode(this.$refs.abstract);
    });
  },
  computed: {
    displayTitle() {
      return pangu.spacing(this.title);
    },
    fullUrl() {
      return `//${window.location.host}/article/${this.filename}`;
    },
  },
  methods: {
    renderAbstract() {
      this.renderedAbstract = marked(this.abstract);
    },
    toArticlePage() {
      this.$router.push(`/article/${this.filename}`);
    },
  },
};
</script>

<style lang="less">
.article-block {
  margin: 2.5rem 0;
  padding-top: 2.5rem;
  border-top: 0.0625rem dashed var(--article-block-border);
  &-title {
    font-size: 1.375rem;
    font-weight: 600;
    letter-spacing: 0.05rem;
    margin-bottom: 1.375rem;
    a {
      display: block;
      width: max-content;
      position: relative;
      text-decoration: none;
      color: var(--article-block-text);
    }
    a:hover {
      cursor: pointer;
    }
    a:visited {
      color: var(--article-block-text);
    }
    a::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      width: 100%;
      height: 0.125rem;
      margin-top: 0.375rem;
      background: var(--article-block-text);
      transform: scale3d(0, 0, 1);
      transition: all 200ms ease-in-out;
    }
    a:hover::after {
      transform: scale3d(1, 1, 1);
    }
    p {
      color: var(--article-text);
    }
  }
  &-abstract {
    font-size: 0.95rem;
    line-height: 2rem;
    color: var(--article-block-text);
  }
  &-footer {
    display: flex;
    align-items: center;
    &-time {
      display: flex;
      align-items: center;
      user-select: none;
      flex: 1 0 auto;
      svg {
        width: 1.125rem;
        height: 1.125rem;
        fill: var(--light-gray);
      }
      span {
        font-size: 0.875rem;
        margin-left: 0.5rem;
        letter-spacing: 0.025rem;
        color: var(--light-gray);
      }
    }
    &-controls {
      flex: 0 0 auto;
      justify-self: flex-end;
      a {
        color: var(--article-block-footer);
        font-size: 0.875rem;
        text-decoration: none;
        display: block;
        width: max-content;
        position: relative;
      }
      a:hover {
        color: var(--primary);
      }
      a::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        width: 100%;
        height: 0.125rem;
        margin-top: 0.25rem;
        background: var(--primary);
        transform: scale3d(0, 0, 1);
        transition: all 200ms ease-in-out;
      }
      a:hover::after {
        transform: scale3d(1, 1, 1);
      }
    }
  }
}
.article-block:first-child {
  margin-top: 0;
}
.article-block:last-child {
  padding-bottom: 2.5rem;
  border-bottom: 0.0625rem dashed var(--article-block-border);
}
</style>
