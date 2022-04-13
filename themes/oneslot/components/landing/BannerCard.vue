<template>
  <div class="landing-banner-wrapper">
    <div class="landing-banner">
      <component :is="bgComponent" v-if="bgComponent" class="landing-banner__bg"></component>
      <div class="landing-banner__content">
        <div
          v-if="avatarStyle"
          :class="{
            'landing-banner__avatar': true,
            'landing-banner__avatar--no-subtitle': !showSubtitle,
          }"
        >
          <div class="avatar-img" :style="avatarStyle"></div>
        </div>
        <div v-if="showSubtitle" class="landing-banner__subtitle">
          {{ subtitle }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    bgComponent() {
      return this.$theme.landing?.banner?.bgComponent;
    },
    avatarStyle() {
      const avatar = this.$theme.landing?.banner?.avatar;
      if (!avatar) {
        return null;
      }
      return `background-image: url('${avatar}')`;
    },
    subtitle() {
      return this.$fragy.subtitle || '';
    },
    showSubtitle() {
      if (!this.subtitle) {
        return false;
      }
      return this.$theme?.landing?.banner?.showSubtitle;
    },
  },
});
</script>

<style lang="less" scoped>
.landing-banner-wrapper {
  width: 100%;
  padding-top: 52.5%;
  margin-top: 0.75rem;
  box-sizing: border-box;
  position: relative;
  user-select: none;
  -webkit-user-drag: none;
  .landing-banner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 2rem;
    overflow: hidden;
    box-shadow: 0 4px 8px var(--banner-shadow);
    background-color: var(--banner-background);
    &__bg {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    &__content {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    &__avatar {
      width: 20%;
      padding-top: 20%;
      position: relative;
      box-sizing: border-box;
      z-index: 5;
      .avatar-img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
    &__avatar--no-subtitle {
      width: 22.5%;
      height: 22.5%;
    }
    &__subtitle {
      z-index: 5;
      font-size: 1.75rem;
      margin: 2% 0;
      font-weight: 600;
      color: var(--text);
      opacity: 0.92;
      filter: drop-shadow(2px 2px 4px var(--text-shadow));
      text-shadow: 2px 2px 6px var(--text-shadow);
      letter-spacing: 0.08rem;
    }
  }
}
</style>
