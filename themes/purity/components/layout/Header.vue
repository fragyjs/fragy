<template>
  <div class="page-header">
    <div class="page-header-title">
      <div v-if="$route.path === '/'" class="page-header-title-main">
        <span>{{ title }}</span>
      </div>
      <a
        v-else
        class="page-header-title-main page-header-title-main--clickable"
        :href="homeUrl"
        @click.prevent="goHome"
      >
        <span>{{ title }}</span>
      </a>
      <div v-if="subtitle" class="page-header-title-sub mobile-hide">
        <span>{{ subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'fragy.purity.layout.header',
  data() {
    const { title, subtitle } = this.$fragy;

    return {
      title,
      subtitle,
      homeUrl: window.location.origin,
    };
  },
  methods: {
    goHome() {
      this.$router.push('/');
      document.title = this.$fragy.title;
    },
  },
});
</script>

<style lang="less">
@header-height: 3rem;

.page-header {
  user-select: none;
  margin-bottom: 2.25rem;
  height: @header-height;
  flex: 0 0 auto;
  &-title {
    display: flex;
    &-main {
      height: @header-height;
      padding: 0.25rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary);
      color: var(--text-title);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.1rem;
      text-decoration: none;
    }
    &-main--clickable {
      transition: 100ms ease-in-out;
    }
    &-main--clickable:hover {
      background: var(--primary-hover);
      cursor: pointer;
    }
    &-main--clickable:active {
      color: var(--text-title);
    }
    &-main--clickable:visited {
      color: var(--text-title);
    }
    &-main--clickable:focus {
      color: var(--text-title);
    }
    &-sub {
      color: var(--text-subtitle);
      align-self: flex-end;
      font-size: 1rem;
      letter-spacing: 0.075rem;
      margin-left: 1rem;
    }
  }
}
</style>
