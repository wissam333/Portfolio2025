<template>
  <div class="stars-container">
    <div class="stars">
      <div
        v-for="(s, i) in stars"
        :key="i"
        class="star-wrapper"
        :style="{ left: s.left }"
      >
        <div
          class="star"
          :class="{ paused: hoveredStar === i }"
          :style="{
            animationDuration: s.animationDuration,
            animationDelay: s.animationDelay,
          }"
          @touchstart="$emit('star-tap', i)"
          @click="$emit('star-tap', i)"
          @mouseenter="$emit('star-enter', i)"
          @mouseleave="$emit('star-leave', i)"
        >
          <div
            class="star-inner"
            :class="{ hovered: hoveredStar === i }"
            :style="{
              '--trailLength': s.trailLength,
              '--animationDuration': s.animationDuration,
              '--animationDelay': s.animationDelay,
              '--size': s.size + 'px',
              opacity: s.opacity,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stars: {
    type: Array,
    required: true,
  },
  hoveredStar: {
    type: Number,
    default: null,
  },
});

defineEmits(["star-enter", "star-leave", "star-tap"]);
</script>

<style lang="scss" scoped>
.stars-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 12;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star-wrapper {
  position: absolute;
  top: 0;
  pointer-events: auto;
  touch-action: none;
}

.star {
  position: absolute;
  top: -20px;
  left: 0;
  width: 0;
  height: 0;
  will-change: transform;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.star.paused {
  animation-play-state: paused;
}

.star-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size, 2px);
  height: var(--size, 2px);
  background: #fff;
  border-radius: 50%;
  opacity: 0.9;
  box-shadow: 0 0 6px #fff, 0 0 12px rgba(255, 255, 255, 0.7);
  transform-origin: center center;
  transition: transform 0.28s ease, box-shadow 0.28s ease, opacity 0.28s ease;
}

.star-inner.hovered {
  transform: scale(3);
  opacity: 1 !important;
  box-shadow: 0 0 20px #fff, 0 0 40px #4fc08d, 0 0 60px #4fc08d;
  z-index: 10;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(45deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(150vh) translateX(-40vw) rotate(45deg);
    opacity: 0;
  }
}

/* Mobile only: add bigger tap zone */
@media (max-width: 768px) {
  .star {
    padding: 10px;
  }
}
</style>
