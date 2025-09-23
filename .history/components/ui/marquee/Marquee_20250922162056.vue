<template>
  <div
    class="marquee-container d-flex overflow-hidden p-2"
    :class="vertical ? 'flex-column' : 'flex-row'"
    :style="`--duration: ${duration}; --gap: ${gap}; gap: ${gap};`"
  >
    <div
      v-for="i in repeat"
      :key="i"
      class="marquee-wrapper d-flex"
      :class="vertical ? 'marquee-vertical flex-column' : 'marquee-horizontal flex-row'"
      @mouseover="pauseOnHover ? pauseAnimation($event) : null"
      @mouseleave="pauseOnHover ? resumeAnimation($event) : null"
      :style="{ animationDirection: reverse ? 'reverse' : 'normal' }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    vertical?: boolean;
    reverse?: boolean;
    pauseOnHover?: boolean;
    repeat?: number;
    duration?: string;
    gap?: string;
  }>(),
  {
    vertical: false,
    reverse: false,
    pauseOnHover: false,
    repeat: 4,
    duration: '40s',
    gap: '1rem',
  }
);

const { vertical, reverse, pauseOnHover, repeat, duration, gap } = props;

const pauseAnimation = (e: Event) => {
  const el = e.currentTarget as HTMLElement;
  el.style.animationPlayState = 'paused';
};

const resumeAnimation = (e: Event) => {
  const el = e.currentTarget as HTMLElement;
  el.style.animationPlayState = 'running';
};
</script>

<style scoped>
.marquee-container {
  position: relative;
}

/* Horizontal animation */
.marquee-horizontal {
  animation: marquee-horizontal var(--duration) linear infinite;
  display: flex;
}

/* Vertical animation */
.marquee-vertical {
  animation: marquee-vertical var(--duration) linear infinite;
  display: flex;
  flex-direction: column;
}

/* Animation keyframes */
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
