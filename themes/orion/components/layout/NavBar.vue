<template>
  <div class="nav-wrapper">
    <div class="logo" @click="onLogoClicked">
      <img :src="logoSrc" />
      <span>{{ projectName }}</span>
    </div>
    <div v-if="Array.isArray(navItems) && navItems.length" class="nav">
      <template v-for="(item, index) in navItems" :key="item.name || index">
        <a-popup-menu
          v-if="item.children"
          class="nav-item"
          transition="nav-fade"
          placement="bottom-end"
          menuClass="nav-item-popup"
          popupClass="nav-menu-wrapper"
          :items="getPopupItems(item.children)"
          :appendToBody="false"
          :hideDelay="300"
          @command="onMenuItemClicked"
        >
          <span class="nav-item__inner">
            <span>{{ item.name }}</span>
            <Icon class="icon-down" icon="ic:round-keyboard-arrow-down" />
          </span>
        </a-popup-menu>
        <a v-else class="nav-item" :href="item.target" @click="navClicked">{{ item.name }}</a>
      </template>
    </div>
    <div class="nav--mobile">
      <div class="icon">
        <Icon icon="mdi:menu" @click="onMobileMenuIconClicked" />
      </div>
    </div>
    <div class="icons">
      <div class="icon">
        <Icon v-if="showGitHubIcon" icon="mdi:github" @click="goGitHub" />
      </div>
    </div>
    <a-collapse :visible="mobileNavVisible" class="nav-mobile-menu">
      <template v-for="(item, index) in navItems">
        <div
          v-if="item.children"
          :key="item.name || index"
          class="nav-mobile-menu__item"
          @click="onMobileMenuSubTabClicked(item.name || `${index}`)"
        >
          <div class="nav-mobile-menu__item-inner">
            <span>{{ item.name }}</span>
            <Icon class="icon-down" icon="ic:round-keyboard-arrow-down" />
          </div>
          <a-collapse class="nav-mobile-menu__sub" :visible="mobileSubMenuVisible[item.name]">
            <div
              v-for="(child, childIdx) in item.children"
              :key="child.name || childIdx"
              class="nav-mobile-menu__sub-item"
              @click.stop="onMobileMenuSubItemClicked(child.target)"
            >
              <span>{{ child.name }}</span>
            </div>
          </a-collapse>
        </div>
        <div v-else :key="item.name || index" class="nav-mobile-menu__item">
          <div class="nav-mobile-menu__inner">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </template>
    </a-collapse>
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
      mobileNavVisible: false,
      mobileSubMenuVisible: {},
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
    route(target) {
      if (!target) {
        console.warn('No route target.');
        return;
      }
      if (target?.startsWith('http')) {
        window.open(target, '_blank');
        return;
      }
      if (target !== this.$route.path) {
        target && this.$router.push(target);
      }
    },
    onLogoClicked() {
      if (!this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    onMenuItemClicked(target) {
      this.route(target);
    },
    onMobileMenuIconClicked() {
      this.mobileNavVisible = !this.mobileNavVisible;
    },
    onMobileMenuSubTabClicked(key) {
      this.mobileSubMenuVisible[key] = !this.mobileSubMenuVisible[key];
    },
    onMobileMenuSubItemClicked(target) {
      this.route(target);
      this.mobileNavVisible = false;
    },
    goGitHub() {
      window.open(`https://github.com/${this.repo}`, '_blank');
    },
  },
});
</script>

<style lang="less">
.nav-fade-enter-active,
.nav-fade-leave-active {
  transition: all 125ms;
}

.nav-fade-enter-to,
.nav-fade-leave-from {
  top: 0 !important;
  opacity: 1 !important;
}

.nav-fade-enter-from,
.nav-fade-leave-active {
  top: -0.25rem !important;
  opacity: 0 !important;
}

.nav-wrapper {
  width: 100%;
  height: var(--nav-height);
  padding: 0 2rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  user-select: none;
  z-index: 20;
  position: fixed;
  top: 0;
  background: var(--page-background);
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
    height: var(--nav-height);
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
      line-height: var(--nav-height);
      height: var(--nav-height);
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
      .nav-menu-wrapper {
        opacity: 1;
      }
      .nav-item-popup {
        background-color: var(--page-background, #fcfdfa);
        box-sizing: border-box;
        padding: 0.5rem 0;
        margin-right: 0.875rem;
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
  }
  .icons {
    justify-self: flex-end;
    line-height: var(--nav-height);
    display: flex;
    align-items: center;
    .icon {
      height: var(--nav-height);
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
  .nav--mobile {
    display: none;
  }
  .nav-mobile-menu {
    position: absolute;
    top: calc(var(--nav-height) - 1px);
    left: 0;
    background-color: var(--page-background, #fcfdfa);
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    width: calc(100vw - 3rem);
    padding: 0 1.5rem;
    &__item {
      line-height: 2rem;
      font-size: 0.875rem;
      svg {
        width: 1.25rem;
        height: 1.125rem;
        padding-left: 0.25rem;
      }
      &-inner {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
    &__item:first-child {
      margin-top: 0.75rem;
    }
    &__item:last-child {
      margin-bottom: 0.75rem;
    }
    &__sub {
      width: 100%;
      box-sizing: border-box;
      padding-left: 0.75rem;
      &-item {
        line-height: 2rem;
        font-size: 0.875rem;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .nav-wrapper {
    padding: 0 1.5rem;
    .icons {
      display: none;
    }
    .logo {
      flex-grow: 0;
    }
    .nav {
      display: none;
    }
    .nav--mobile {
      width: max-content;
      height: var(--nav-height);
      line-height: var(--nav-height);
      justify-self: flex-end;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-grow: 1;
      .icon {
        height: var(--nav-height);
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
    }
  }
}
</style>
