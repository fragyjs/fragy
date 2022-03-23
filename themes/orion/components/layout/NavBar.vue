<template>
  <div class="nav-wrapper">
    <div class="logo" @click="logoClicked">
      <img :src="logoSrc" />
      <span>{{ projectName }}</span>
    </div>
    <div v-if="Array.isArray(navItems) && navItems.length" class="nav">
      <template v-for="(item, index) in navItems" :key="index">
        <a-popup-menu
          v-if="item.children"
          class="nav-item"
          transition="nav-fade"
          placement="bottom-end"
          menuClass="nav-item-popup"
          :items="getPopupItems(item.children)"
          :appendToBody="false"
          :hideDelay="300"
          @command="menuItemClicked"
        >
          <span class="nav-item__inner">
            <span>{{ item.name }}</span>
            <Icon class="icon-down" icon="ic:round-keyboard-arrow-down"></Icon>
          </span>
        </a-popup-menu>
        <a v-else class="nav-item" :href="item.target" @click="navClicked">{{ item.name }}</a>
      </template>
    </div>
    <div class="icons">
      <div class="icon">
        <Icon v-if="showGitHubIcon" icon="mdi:github" @click="goGitHub"></Icon>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';

export default defineComponent({
  components: {
    Icon,
  },
  data() {
    return {
      logoSrc: this.$theme.project?.logo || '',
      projectName: this.$theme.project?.name || '',
      navItems: this.$theme.nav?.items || [],
      repo: this.$theme.project?.repo || '',
      showGitHub: !!this.$theme.nav?.icons?.github,
    };
  },
  computed: {
    showGitHubIcon() {
      return this.showGitHub && this.repo;
    },
  },
  methods: {
    getPopupItems(children) {
      return children.map((child) => ({
        key: child.target,
        name: child.name,
      }));
    },
    logoClicked() {
      if (!this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    menuItemClicked(key) {
      // key is the same as target
      this.route(key);
    },
    route(target) {
      if (target?.startsWith('http')) {
        window.open(target, '_blank');
        return;
      }
      if (target !== this.$route.path) {
        target && this.$router.push(target);
      }
    },
    goGitHub() {
      window.open(`https://github.com/${this.repo}`, '_blank');
    },
  },
});
</script>

<style lang="less">
@nav-height: 3.5rem;

.nav-fade-enter-active,
.nav-fade-leave-active {
  transition: all 125ms;
}

.nav-fade-enter-to {
  top: 0 !important;
  opacity: 1;
}

.nav-fade-enter-from,
.nav-fade-leave-active {
  top: -0.25rem !important;
  opacity: 0;
}

.nav-wrapper {
  width: 100%;
  height: @nav-height;
  padding: 0 2rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  user-select: none;
  z-index: 20;
  .logo {
    display: flex;
    align-items: center;
    flex: 1;
    cursor: pointer;
    transition: opacity 100ms ease;
    img {
      width: 2rem;
      height: 2rem;
    }
    span {
      font-size: 1rem;
      font-weight: 500;
      padding-left: 0.5rem;
      color: var(--text-primary);
    }
  }
  .logo:hover {
    opacity: 0.7;
  }
  .nav {
    width: max-content;
    height: @nav-height;
    justify-self: flex-end;
    flex-shrink: 0;
    &-item {
      align-items: center;
      font-weight: 500;
      font-size: 0.875rem;
      padding: 0 0.75rem;
      text-decoration: none;
      cursor: pointer;
      box-sizing: border-box;
      line-height: @nav-height;
      height: @nav-height;
      color: var(--text-primary);
      transition: opacity 100ms ease;
      &__inner {
        display: inline-flex;
        align-items: center;
        color: var(--text-primary);
        .icon-down {
          width: 1.25rem;
          height: 1.125rem;
          padding-left: 0.25rem;
        }
      }
      .nav-item-popup {
        opacity: 1 !important;
        background-color: var(--page-background, #fcfdfa);
        box-sizing: border-box;
        padding: 0.5rem 0;
        box-shadow: 0 -0.125rem 1rem rgba(0, 14, 10, 0.175);
        border-radius: 0.75rem;
        line-height: 1.75rem;
        overflow: hidden;
        .a-popup-menu__item {
          font-size: 0.875rem;
          font-weight: 400;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0.375rem 1rem;
          user-select: none;
        }
        .a-popup-menu__item:hover {
          background-color: rgba(0, 0, 0, 0.075);
        }
      }
    }
    &-item:last-child {
      margin-right: 0;
    }
    &-item:hover {
      opacity: 0.8;
    }
  }
  .icons {
    justify-self: flex-end;
    line-height: @nav-height;
    display: flex;
    align-items: center;
    .icon {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 100ms ease;
      svg {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
    .icon:hover {
      opacity: 1;
    }
  }
}
</style>
