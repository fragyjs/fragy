<template>
  <div class="landing-wrapper">
    <div class="landing">
      <div class="landing-banner">
        <div class="landing-banner__bg">
          <component :is="bannerBgComp" v-if="bannerBgComp"></component>
        </div>
        <div class="landing-banner__content">
          <div class="landing-banner__title">
            <a-gradient-text>{{ projectName }}</a-gradient-text>
          </div>
          <div v-if="projectDesc" class="landing-banner__desc">{{ projectDesc }}</div>
          <div class="landing-banner__cards">
            <BannerCard
              v-for="(card, index) in bannerCards"
              :key="card.title"
              :card="card"
              :index="index"
              :total="bannerCards.length"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BannerCard from '../components/landing/BannerCard.vue';

export default {
  components: {
    BannerCard,
  },
  data() {
    return {
      projectName: this.$theme.project?.name,
      projectDesc: this.$theme.project?.desc,
      bannerBgComp: this.$theme.landing?.banner?.bgComponent || '',
      bannerCards: this.$theme.landing?.banner?.cards || [],
    };
  },
};
</script>

<style lang="less" scoped>
.landing-wrapper {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  position: relative;
  .landing {
    width: 100%;
    max-width: 70rem;
    margin: 0 auto;
    &-banner {
      position: relative;
      &__bg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
      }
      &__content {
        z-index: 5;
        padding: 0 4rem;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        z-index: 5;
        user-select: none;
      }
      &__title {
        font-size: 8rem;
        font-weight: 700;
        padding: var(--nav-height) 0 3rem 0;
        box-sizing: border-box;
        letter-spacing: 0.1rem;
        text-shadow: 3px 3px 12px rgba(0, 0, 0, 0.02);
      }
      &__desc {
        font-size: var(--nav-height);
        font-weight: 600;
        color: var(--text-primary);
        text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.02);
      }
      &__cards {
        padding: 4rem 0 6rem 0;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        height: max-content;
        position: relative;
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .landing-wrapper {
    .landing {
      &-banner {
        &__title {
          font-size: 6.5rem;
          text-align: center;
        }
        &__desc {
          text-align: center;
          line-height: 2.75rem;
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .landing-wrapper {
    .landing {
      &-banner {
        &__bg {
          height: 50rem;
        }
        &__cards {
          display: block;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .landing-wrapper {
    .landing {
      &-banner {
        &__bg {
          height: 30rem;
        }
        &__content {
          padding: 0 1.5rem;
        }
        &__title {
          font-size: 4rem;
          padding: 2.375rem 1.5rem 2.5rem 1.5rem;
        }
        &__desc {
          font-size: 2rem;
        }
        &__cards {
          padding: 4rem 0 5rem 0;
        }
      }
    }
  }
}
</style>
