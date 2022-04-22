<template>
  <nav class="nav">
    <div
      :class="{
        'nav-title': true,
        'nav-title--clickable': titleClickable,
      }"
    >
      <a href="/" @click.prevent="toHome">{{ title }}</a>
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
    titleClickable() {
      return this.$route.path !== '/';
    },
  },
  methods: {
    toHome() {
      if (this.$route.name === 'Landing') {
        return;
      }
      this.$router.push({
        name: 'Landing',
      });
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
    a {
      font-weight: 600;
      letter-spacing: 0.05rem;
      font-size: 1.125rem;
      color: var(--text);
      text-decoration: none;
      opacity: 0.85;
      transition: opacity ease 200ms;
      cursor: default;
      user-select: none;
    }
  }
  &-title--clickable {
    a {
      cursor: pointer;
    }
    a:hover {
      opacity: 1;
    }
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
