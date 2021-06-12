<template>
  <div class="page-footer" v-if="showFooter">
    <div class="page-footer-text page-footer-poweredby" v-if="showPoweredBy">
      <span>Powered by Fragy.</span>
      <a href="https://github.com/pwp-app/fragy" target="_blank" v-if="showGitHub">
        <GitHub />
      </a>
    </div>
    <div class="page-footer-text page-footer-beian" v-if="showBeian && displayBeianText">
      <a href="https://beian.miit.gov.cn/" target="_blank">{{ displayBeianText }}</a>
    </div>
    <div class="page-footer-text page-footer-theme">
      <span>
        <Moon v-if="darkModeEnabled" />
        <Sun v-else />
      </span>
    </div>
  </div>
</template>

<script>
import pangu from 'pangu.simple';
import GitHub from '../icons/GitHub';
import Sun from '../icons/Sun';
import Moon from '../icons/Moon';

export default {
  name: 'fragy.purity.layout.footer',
  components: {
    GitHub,
    Sun,
    Moon,
  },
  data() {
    const {
      enable: showFooter,
      beian: { enable: showBeian, text: beianText },
      poweredby: { enable: showPoweredBy, github: showGitHub },
    } = this.$fragy.themeConfig.footer;

    return {
      showFooter,
      showBeian,
      beianText,
      showPoweredBy,
      showGitHub,
      darkModeEnabled: false,
    };
  },
  computed: {
    displayBeianText() {
      if (!this.beianText) {
        return null;
      }
      return pangu.spacing(this.beianText);
    },
  },
};
</script>

<style lang="less">
.page-footer {
  flex: 0 0 auto;
  justify-self: flex-end;
  user-select: none;
  margin: 2rem 0 1.5rem 0;
  display: flex;
  align-items: center;
  &-text {
    color: var(--text-footer);
    svg {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      fill: var(--text-footer);
      transform: translateY(2.5px);
      cursor: pointer;
    }
    svg:hover {
      fill: var(--text-footer-hover);
    }
  }
  &-text::after {
    content: '|';
    display: inline-block;
    margin: 0px 12px;
  }
  &-text:last-child::after {
    content: '';
    display: none;
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
      margin-left: 0.375rem;
    }
  }
  &-beian {
    a {
      font-size: 14px;
      color: var(--text-footer);
      text-decoration: none;
    }
    a:hover {
      color: var(--text-footer-hover) !important;
    }
    a:visited {
      color: var(--text-footer);
    }
  }
}
</style>
