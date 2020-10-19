<template>
  <div class="page-footer" v-if="showFooter">
    <div class="page-footer-text page-footer-poweredby" v-if="showPoweredBy">
      <span>Powered by fragy.<GitHub v-if="showGitHub"/></span>
    </div>
    <div class="page-footer-text page-footer-beian" v-if="showBeian">
      <span>{{beianText}}</span>
    </div>
  </div>
</template>

<script>
import GitHub from '../icons/GitHub';

export default {
  name: 'fragy.purify.layout.footer',
  components: {
    GitHub,
  },
  data() {
    const {
      enable: showFooter,
      beian: {
        enable: showBeian,
        text: beianText,
      },
      poweredby: {
        enable: showPoweredBy,
        github: showGitHub,
      },
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
