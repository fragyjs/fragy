<template>
  <div class="article-menu__switch">
    <Icon icon="fa6-solid:caret-right" />
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped>
.article-menu__switch {
  position: fixed;
  bottom: calc(2.5rem + env(safe-area-inset-bottom));
  box-sizing: border-box;
  padding: 0.75rem 0.375rem;
  background: var(--page-background);
  border-bottom: 1px solid var(--primary);
  border-right: 1px solid var(--primary);
  border-top: 1px solid var(--primary);
  border-radius: 0 0.375rem 0.375rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.08);
  transition: filter 200ms ease;
  svg {
    color: var(--primary);
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.08));
  }
}
.article-menu__switch:hover {
  filter: brightness(0.95);
}
.article-menu__switch:active {
  filter: brightness(0.9);
}
</style>
