<template>
  <div class="page-footer" v-if="showFooter">
    <div class="page-footer-text page-footer-poweredby" v-if="showPoweredBy">
      <span>Powered by Fragy.</span>
      <GitHub v-if="showGitHub" />
    </div>
    <div class="page-footer-text page-footer-beian" v-if="showBeian">
      <span>{{ beianText }}</span>
    </div>
  </div>
</template>

<script>
import GitHub from '../icons/GitHub';

export default {
  name: 'fragy.purity.layout.footer',
  components: {
    GitHub,
  },
  data() {
    const {
      enable: showFooter,
      beian: { enable: showBeian, text: beianText },
      poweredby: { enable: showPoweredBy, github: showGitHub },
    } = this.$fragy.theme.config.footer;

    return {
      showFooter,
      showBeian,
      beianText,
      showPoweredBy,
      showGitHub,
    };
  },
};
</script>

<style lang="less">
.page-footer {
  flex: 0 0 auto;
  justify-self: flex-end;
  user-select: none;
  margin: 2rem 0 0.5rem 0;
  &-text {
    color: var(--text-footer);
  }
  &-poweredby {
    height: 1.5rem;
    display: flex;
    align-items: center;
    span {
      display: block;
      font-size: 0.875rem;
      letter-spacing: 0.05rem;
    }
    .icon-github {
      display: block;
      width: 1rem;
      height: 1rem;
      fill: var(--text-footer);
      margin-left: 0.375rem;
      transform: translateY(0.0625rem);
    }
  }
}
</style>
