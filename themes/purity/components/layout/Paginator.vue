<template>
  <div class="purity-pager">
    <div
      v-if="currentPage > 1"
      class="purity-pager-item purity-pager-item__prev"
      @click="setPage(currentPage - 1)"
    >
      <Prev />
    </div>
    <div
      :class="{
        'purity-pager-item': true,
        'purity-pager-item__first': true,
        'purity-pager-item__current': currentPage === 1,
      }"
      @click="setPage(1)"
    >
      <span>1</span>
    </div>
    <div v-if="currentPage > 3" class="purity-pager-item purity-page-item__ellipsis">
      <span>...</span>
    </div>
    <div v-if="currentPage > 2" class="purity-pager-item" @click="setPage(currentPage - 1)">
      <span>{{ currentPage - 1 }}</span>
    </div>
    <div
      v-if="currentPage !== 1 && currentPage !== pageCount"
      class="purity-pager-item purity-pager-item__current"
    >
      <span>{{ currentPage }}</span>
    </div>
    <div
      v-if="pageCount - currentPage >= 2"
      class="purity-pager-item"
      @click="setPage(currentPage + 1)"
    >
      <span>{{ currentPage + 1 }}</span>
    </div>
    <div v-if="pageCount - currentPage > 2" class="purity-pager-item purity-pager-item__ellipsis">
      <span>...</span>
    </div>
    <div
      v-if="pageCount > 1"
      :class="{
        'purity-pager-item': true,
        'purity-pager-item__last': true,
        'purity-pager-item__current': currentPage === pageCount,
      }"
      @click="setPage(pageCount)"
    >
      <span>{{ pageCount }}</span>
    </div>
    <div
      v-if="currentPage < pageCount"
      class="purity-pager-item purity-pager__next"
      @click="setPage(currentPage + 1)"
    >
      <Next />
    </div>
  </div>
</template>

<script>
import Prev from '../icons/Prev';
import Next from '../icons/Next';

export default {
  name: 'fragy.purity.pager',
  components: {
    Prev,
    Next,
  },
  props: {
    pageCount: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  methods: {
    setPage(page) {
      this.$emit('change', page);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style lang="less">
.purity-pager {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 2rem;
  &-item {
    display: flex;
    align-items: center;
    height: 2rem;
    margin: 0 0.625rem;
    font-size: 0.875rem;
    user-select: none;
    span {
      color: var(--paginator-back);
      cursor: pointer;
    }
    span:hover {
      color: var(--paginator-front);
    }
    svg {
      width: 1.125rem;
      height: 1.125rem;
      fill: var(--paginator-back);
      cursor: pointer;
    }
    svg:hover {
      fill: var(--paginator-front);
    }
  }
  &-item__current {
    span {
      color: var(--paginator-front);
      cursor: default;
    }
    border-bottom: 0.0625rem solid var(--paginator-front);
  }
  &-item:first-child {
    margin-left: 0;
  }
}
</style>
