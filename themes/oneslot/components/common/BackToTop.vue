<template>
  <transition name="back2top">
    <div v-if="enabled" v-show="showed" class="back2top" @click="handleClick">
      <arrow-up />
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue';
import ArrowUp from './icons/ArrowUp.vue';

export default defineComponent({
  components: {
    ArrowUp,
  },
  data() {
    return {
      lastOffset: 0,
      showed: false,
    };
  },
  computed: {
    enabled() {
      return !!this.$theme.backToTop;
    },
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  mounted() {
    this.lastOffset = window.scrollY;
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // event
    hide() {
      if (!this.showed) {
        return;
      }
      this.showed = false;
    },
    show() {
      if (this.showed) {
        return;
      }
      this.showed = true;
    },
    handleScroll() {
      if (window.scrollY - this.lastOffset < -50) {
        this.hide();
        this.lastOffset = window.scrollY;
      } else if (window.scrollY - this.lastOffset > 100) {
        this.show();
        this.lastOffset = window.scrollY;
      }
    },
    handleClick() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
});
</script>

<style lang="less">
.back2top {
  position: fixed;
  bottom: 3.725rem;
  right: 3.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  z-index: 10;
  cursor: pointer;
  transition: all 200ms ease;
  user-select: none;
  svg {
    font-size: 1.5rem;
    path {
      fill: #fff;
      stroke: #fff;
    }
  }
}
.back2top:hover {
  opacity: 0.6;
}
.back2top-enter-active {
  opacity: 0;
  transform: translateY(-0.75rem);
}
.back2top-enter-to,
.back2top-leave-active {
  opacity: 0.3;
  transform: translateY(0);
}
.back2top-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}

@media screen and (max-width: 1138px) {
  .back2top {
    bottom: 1rem;
    right: 1.475rem;
    opacity: 0.15;
  }
  .back2top-enter-to,
  .back2top-leave-active {
    opacity: 0.15;
  }
}
</style>
