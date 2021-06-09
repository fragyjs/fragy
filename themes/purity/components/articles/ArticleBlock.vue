<template>
  <div class="article-block">
    <div class="article-block-title">
      <span>{{ title }}</span>
    </div>
    <div class="article-block-abstract" v-html="renderedAbstract"></div>
    <div class="article-block-footer">
      <div class="article-block-footer-time">
        <Date />
        <span>{{ date }}</span>
      </div>
      <div class="article-block-footer-controls">
        <a :href="fullUrl" class="button-read-all">阅读全文</a>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '../icons/Date';
import marked from '../../utils/marked';

export default {
  name: 'fragy.purity.articles.block',
  props: {
    title: String,
    abstract: String,
    date: String,
    fullUrl: String,
  },
  components: {
    Date,
  },
  computed: {
    renderedAbstract() {
      return marked(this.abstract);
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
    color: var(--article-block-text);
    span {
      display: block;
      max-width: max-content;
      position: relative;
    }
    span:hover {
      cursor: pointer;
    }
    span::after {
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
    span:hover::after {
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
