<template>
  <p class="notfound">
    {{ $t('not_found') }}<a href="/" @click.prevent="goHome">{{ $t('go_home') }}</a>
  </p>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const goHome = () => {
      const router = useRouter();
      router.replace('/');
    };

    return { goHome };
  },
});
</script>

<style lang="less">
.notfound {
  color: var(--notfound-text);
  a {
    position: relative;
    display: inline-block;
    width: max-content;
    margin-left: 0.75rem;
    text-decoration: none;
  }
  a:hover {
    cursor: pointer;
  }
  a:visited {
    color: var(--primary);
  }
  a::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: 0.1rem;
    margin-top: 0.25rem;
    background: var(--primary);
    transform: scale3d(0, 0, 1);
    transition: all 200ms ease-in-out;
  }
  a:hover::after {
    transform: scale3d(1, 1, 1);
  }
}
</style>
