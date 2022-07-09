<template>
  <div class="landing-banner-card" :style="cardStyle">
    <div class="landing-banner-card__title">
      {{ card.title || '' }}
    </div>
    <div class="landing-banner-card__desc">
      {{ card.desc || '' }}
    </div>
    <div
      v-if="card.action"
      class="landing-banner-card__action"
      @click="cardAction(card.action.target)"
    >
      <span>{{ card.action.text }}</span>
      <Icon v-if="card.action.icon" :icon="card.action.icon" width="1rem" />
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  components: {
    Icon,
  },
  props: {
    card: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
    },
    total: {
      type: Number,
    },
  },
  computed: {
    cardStyle() {
      return {
        opacity: 1 - this.total * 0.125 + this.index * 0.125,
      };
    },
  },
  methods: {
    cardAction(target) {
      if (target?.startsWith('http')) {
        window.open(target, '_blank');
        return;
      }
      if (target !== this.$route.path) {
        target && this.$router.push(target);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.landing-banner-card {
  width: calc((100% - 3rem) / 3);
  margin-right: 1.5rem;
  box-sizing: border-box;
  padding: 1.625rem 1.75rem;
  color: var(--banner-card-text);
  background-color: var(--primary);
  border-radius: 1rem;
  box-shadow: 0 0.125rem 1rem rgba(0, 12, 7, 0.1);
  user-select: none;
  display: flex;
  flex-direction: column;
  &__title {
    font-size: 1.5rem;
    margin-bottom: 0.875rem;
    font-weight: 700;
  }
  &__desc {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    flex: 1;
  }
  &__action {
    background-color: var(--banner-card-action);
    color: var(--primary);
    box-sizing: border-box;
    padding: 0.875rem 1rem;
    font-weight: 600;
    margin: 1.5rem 0 0.375rem 0;
    border-radius: 0.75rem;
    box-shadow: 0.125rem 0.125rem 0.5rem rgba(0, 12, 7, 0.05);
    cursor: pointer;
    transition: all 150ms ease-out;
    display: flex;
    align-items: center;
    > span {
      flex: 1;
    }
  }
  &__action:hover {
    opacity: 0.9;
  }
}
.landing-banner-card:last-child {
  margin-right: 0;
}

@media screen and (max-width: 960px) {
  .landing-banner-card {
    width: 100%;
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
  .landing-banner-card:last-child {
    margin-bottom: 0;
  }
}
</style>
