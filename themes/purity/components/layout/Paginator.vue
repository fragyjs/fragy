<template>
  <div class="purity-pager">
    <div
      class="purity-pager-item purity-pager-item__prev"
      v-if="currentPage > 1"
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
    <div class="purity-pager-item purity-page-item__ellipsis" v-if="currentPage > 3">
      <span>...</span>
    </div>
    <div class="purity-pager-item" v-if="currentPage > 2" @click="setPage(currentPage - 1)">
      <span>{{ currentPage - 1 }}</span>
    </div>
    <div
      class="purity-pager-item purity-pager-item__current"
      v-if="currentPage !== 1 && currentPage !== pageCount"
    >
      <span>{{ currentPage }}</span>
    </div>
    <div
      class="purity-pager-item"
      v-if="pageCount - currentPage >= 2"
      @click="setPage(currentPage + 1)"
    >
      <span>{{ currentPage + 1 }}</span>
    </div>
    <div class="purity-pager-item purity-pager-item__ellipsis" v-if="pageCount - currentPage > 2">
      <span>...</span>
    </div>
    <div
      :class="{
        'purity-pager-item': true,
        'purity-pager-item__last': true,
        'purity-pager-item__current': currentPage === pageCount,
      }"
      v-if="pageCount > 1"
      @click="setPage(pageCount)"
    >
      <span>{{ pageCount }}</span>
    </div>
    <div
      class="purity-pager-item purity-pager__next"
      v-if="currentPage < pageCount"
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
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style lang="less">
.purity-pager {
  width: 100%;
  display: flex;
  align-items: center;
  &-item {
    display: flex;
    align-items: center;
    height: 2rem;
    margin: 0 0.625rem;
    font-size: 0.875rem;
    user-select: none;
    box-sizing: border-box;
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
