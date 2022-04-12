<template>
  <nav class="nav">
    <div class="nav-title">
      {{ title }}
    </div>
    <div class="nav-links">
      <a
        v-for="navItem in navItems"
        :key="navItem.target"
        class="nav-links__item"
        :href="navItem.target"
      >
        {{ navItem.text }}
      </a>
    </div>
  </nav>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    title() {
      return this.$fragy?.title || 'Fragy';
    },
    navItems() {
      return this.$theme?.nav || [];
    },
  },
});
</script>

<style lang="less" scoped>
.nav {
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  &-title {
    font-weight: 600;
    letter-spacing: 0.05rem;
    font-size: 1.125rem;
    color: var(--text);
  }
  &-links {
    &__item {
      font-size: 0.875rem;
      color: var(--nav-text);
      margin-right: 1.5rem;
      text-decoration: none;
      letter-spacing: 0.025rem;
      opacity: 0.75;
      transition: opacity 200ms ease;
    }
    &__item:last-child {
      margin-right: 0;
    }
    &__item:hover {
      opacity: 1;
    }
  }
}
</style>
