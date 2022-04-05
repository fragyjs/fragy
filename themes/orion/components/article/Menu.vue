<template>
  <div class="article-menu">
    <a
      v-for="item in menu"
      :key="item.text"
      :href="item.anchor"
      :class="[
        'article-menu-link',
        `article-menu-link--level-${item.level}`,
        {
          'article-menu-link--active': activeAnchor.includes(item.anchor),
        },
      ]"
    >
      <p class="article-menu-link__text">{{ item.text }}</p>
    </a>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['menu'],
  watch: {
    menu() {
      this.activeAnchor = [];
    },
    activeAnchor() {
      this.$forceUpdate();
    },
  },
  data() {
    return {
      activeAnchor: [],
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    // trigger calculate when first enter
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop;
      let res;
      for (let i = 0; i < this.menu.length; i++) {
        const item = this.menu[i];
        const itemAnchor = document.querySelector(`a[name="${item.anchor.slice(1)}"]`);
        if (!itemAnchor) {
          return;
        }
        if (itemAnchor.offsetTop > scrollTop) {
          res = item;
          break;
        }
      }
      res = res || this.menu[this.menu.length - 1];
      if (!res) {
        this.activeAnchor = [];
        return;
      }
      if (res.parent) {
        this.activeAnchor = [res.anchor, res.parent];
      } else {
        this.activeAnchor = [res.anchor];
      }
    },
  },
});
</script>

<style lang="less">
.article-menu {
  max-height: 100%;
  padding: 0.625rem 1.75rem;
  overflow-y: auto;
  box-sizing: border-box;
  .article-menu-link {
    font-size: 0.875rem;
    text-decoration: none;
    color: var(--text-primary);
    transition: color 100ms ease;
    p {
      margin: 1rem 0;
    }
  }
  .article-menu-link--level-2 {
    font-weight: 600;
    p {
      font-size: 0.875rem;
    }
  }
  .article-menu-link--level-3 {
    font-weight: 300;
    p {
      font-size: 0.825rem;
      padding-left: 0.75rem;
    }
  }
  .article-menu-link--active {
    color: var(--primary);
  }
}
@scrollbar-width: 0.55rem;
.article-menu::-webkit-scrollbar {
  width: @scrollbar-width;
  height: @scrollbar-width;
}
.article-menu::-webkit-scrollbar-button {
  display: none;
}
.article-menu::-webkit-scrollbar-thumb {
  width: @scrollbar-width;
  border-radius: @scrollbar-width;
  background: var(--primary);
}
.article-menu::-webkit-scrollbar-track {
  background: var(--page-background);
}
.article-menu::-webkit-scrollbar-corner {
  background: var(--page-background);
}
</style>
