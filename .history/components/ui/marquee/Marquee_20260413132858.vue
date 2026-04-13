<template>
  <div
    class="marquee-container"
    :class="{ vertical }"
    :style="{
      '--duration': duration,
      '--gap': gap,
    }"
    @mouseover="pauseOnHover ? pause() : undefined"
    @mouseleave="pauseOnHover ? resume() : undefined"
  >
    <div class="vignette left" aria-hidden="true" />

    <div
      v-for="i in repeat"
      :key="i"
      class="marquee-wrapper"
      :class="vertical ? 'vertical-wrapper' : 'horizontal-wrapper'"
      :style="{ animationDirection: reverse ? 'reverse' : 'normal' }"
    >
      <slot />
    </div>

    <div class="vignette right" aria-hidden="true" />
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
  },
);

const containerRef = ref<HTMLElement | null>(null);

// Toggle a single CSS var on the container — no querySelectorAll needed
const setPlayState = (state: "paused" | "running") => {
  containerRef.value?.style.setProperty("--play-state", state);
};

const pause = () => setPlayState("paused");
const resume = () => setPlayState("running");
</script>

<style scoped>
.marquee-container {
  display: flex;
  overflow: hidden;
  padding: 0.5rem;
  gap: var(--gap, 1rem);
  --duration: 40s;
  --gap: 1rem;
  --play-state: running;
  position: relative;
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
  animation-play-state: var(--play-state, running);
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

.vignette {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3rem;
  pointer-events: none;
  z-index: 10;
}
.vignette.left {
  left: 0;
  background: linear-gradient(to right, rgb(18 18 18), transparent);
}
.vignette.right {
  right: 0;
  background: linear-gradient(to left, rgb(18 18 18), transparent);
}
</style>
