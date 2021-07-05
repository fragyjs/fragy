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
    <div class="page-footer-text page-footer-theme" v-if="showThemeSwitcher">
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
        this.removeDarkClass();
        window.localStorage.setItem('fragy-purity-dark', false);
        this.$bus.$emit('color-theme-changed', 'light');
      } else {
        this.addDarkClass();
        window.localStorage.setItem('fragy-purity-dark', true);
        this.$bus.$emit('color-theme-changed', 'dark');
      }
    },
    addDarkClass() {
      !document.documentElement.classList.contains('dark') &&
        document.documentElement.classList.add('dark');
      const linkEl = document.getElementById('hl-theme');
      linkEl.setAttribute('href', this.$theme.vendors.highlightjs.github);
    },
    removeDarkClass() {
      document.documentElement.classList.contains('dark') &&
        document.documentElement.classList.remove('dark');
      const linkEl = document.getElementById('hl-theme');
      linkEl.setAttribute('href', this.$theme.vendors.highlightjs.githubDark);
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
