<template>
  <div v-if="showFooter" class="page-footer">
    <div v-if="showPoweredBy" class="page-footer-text page-footer-poweredby">
      <span>Powered by Fragy.</span>
      <a v-if="showGitHub" href="https://github.com/pwp-app/fragy" target="_blank">
        <GitHub />
      </a>
    </div>
    <div v-if="showBeian && displayBeianText" class="page-footer-text page-footer-beian">
      <a href="https://beian.miit.gov.cn/" target="_blank">{{ displayBeianText }}</a>
    </div>
    <div v-if="showThemeSwitcher" class="page-footer-text page-footer-theme">
      <span>
        <Moon v-if="darkModeEnabled.value" @click.native="switchColorTheme" />
        <Sun v-else @click.native="switchColorTheme" />
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
      themeSwitcher: { enable: showThemeSwitcher },
    } = this.$theme.footer;

    return {
      showFooter,
      showBeian,
      beianText,
      showPoweredBy,
      showGitHub,
      showThemeSwitcher,
    };
  },
  inject: ['darkModeEnabled'],
  computed: {
    displayBeianText() {
      if (!this.beianText) {
        return null;
      }
      return pangu.spacing(this.beianText);
    },
  },
  methods: {
    switchColorTheme() {
      if (this.darkModeEnabled.value) {
        this.$bus.$emit('color-theme-changed', 'light');
      } else {
        this.$bus.$emit('color-theme-changed', 'dark');
      }
    },
  },
};
</script>

<style lang="less">
.page-footer {
  flex: 0 0 auto;
  justify-self: flex-end;
  user-select: none;
  margin: 2rem 0 1.625rem 0;
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
    opacity: 0.6;
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
      font-size: 0.8rem;
      letter-spacing: 0.05rem;
    }
    .icon-github {
      margin-left: 0.375rem;
    }
  }
  &-beian {
    a {
      font-size: 0.8rem;
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

@media screen and (max-width: 767px) {
  .page-footer {
    margin: 2rem 0 1.5rem 0;
  }
}
</style>
