<template>
  <div class="marquee-container" :class="{ vertical: vertical }">
    <div
      v-for="index in repeat"
      :key="index"
      class="marquee-wrapper"
      :class="{ 'vertical-wrapper': vertical, 'horizontal-wrapper': !vertical }"
      :style="{ animationDirection: reverse ? 'reverse' : 'normal' }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    reverse?: boolean;
    pauseOnHover?: boolean;
    vertical?: boolean;
    repeat?: number;
    duration?: string;
    gap?: string;
  }>(),
  {
    reverse: false,
    pauseOnHover: false,
    vertical: false,
    repeat: 4,
    duration: "40s",
    gap: "1rem",
  }
);

const { pauseOnHover, duration, gap } = props;

const pauseAnimation = (e: Event) => {
  const el = e.currentTarget as HTMLElement;
  el.style.animationPlayState = "paused";
};

const resumeAnimation = (e: Event) => {
  const el = e.currentTarget as HTMLElement;
  el.style.animationPlayState = "running";
};
</script>

<style scoped>
.marquee-container {
  display: flex;
  overflow: hidden;
  padding: 0.5rem; /* same as p-2 */
  gap: var(--gap, 1rem);
  --duration: 40s;
  --gap: 1rem;
}

.marquee-container.vertical {
  flex-direction: column;
}

.marquee-wrapper {
  display: flex;
  flex-shrink: 0;
  justify-content: space-around;
  gap: var(--gap, 1rem);
  animation-duration: var(--duration, 40s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.horizontal-wrapper {
  flex-direction: row;
  animation-name: marquee-horizontal;
}

.vertical-wrapper {
  flex-direction: column;
  animation-name: marquee-vertical;
}

@keyframes marquee-horizontal {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
}

@keyframes marquee-vertical {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(calc(-100% - var(--gap)));
  }
}
</style>
