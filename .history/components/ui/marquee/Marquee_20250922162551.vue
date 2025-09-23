<template>
  <div
    class="group flex overflow-hidden p-2"
    :class="vertical ? 'flex-col' : 'flex-row'"
    :style="`--duration: ${duration}; --gap: ${gap}`"
  >
    <div
      v-for="index in repeat"
      :key="index"
      class="flex shrink-0 justify-around"
      :class="vertical ? 'flex-col animate-marquee-vertical' : 'flex-row animate-marquee'"
      @mouseover="pauseOnHover ? $event.currentTarget.style.animationPlayState='paused' : null"
      @mouseleave="pauseOnHover ? $event.currentTarget.style.animationPlayState='running' : null"
      :style="{ animationDirection: reverse ? 'reverse' : 'normal', gap: gap }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
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
    gap: '1rem'
  }
);

const { vertical, reverse, pauseOnHover, repeat, duration, gap } = props;
</script>

<style scoped>
.animate-marquee {
  animation: marquee var(--duration) linear infinite;
}

.animate-marquee-vertical {
  animation: marquee-vertical var(--duration) linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% - var(--gap))); }
}

@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--gap))); }
}
</style>
