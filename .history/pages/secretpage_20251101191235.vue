<template>
  <div class="snow-container">
    <!-- Snowfall Background -->
    <div class="snowfall">
      <div
        v-for="(snowflake, index) in snowflakes"
        :key="index"
        class="snowflake-wrapper"
        :style="{ left: snowflake.left }"
      >
        <div
          @click="(e) => (e.target.style = 'display:none')"
          class="snowflake"
          :class="{ paused: hoveredSnowflake === index }"
          :style="{
            animationDuration: snowflake.animationDuration,
            animationDelay: snowflake.animationDelay,
            opacity: snowflake.opacity,
          }"
          @mouseenter="onSnowflakeEnter(index)"
          @mouseleave="onSnowflakeLeave"
        >
          <div
            class="snowflake-inner"
            :class="{ hovered: hoveredSnowflake === index }"
            :style="{
              '--size': snowflake.size + 'px',
              '--rotation': snowflake.rotation + 'deg',
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Optional: Snow Pile Effect at Bottom -->
    <div class="snow-pile"></div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "empty" });

// Snowflake state
const hoveredSnowflake = ref(null);
const snowflakes = ref([]);

// Create snowflakes with realistic parameters
function createSnowflakes(count = 80) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 6 + 2; // 2px to 8px
    const opacity = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
    const animationDuration = (Math.random() * 10 + 8).toFixed(2) + "s"; // 8-18s
    const animationDelay = (Math.random() * 5).toFixed(2) + "s";
    const left = Math.random() * 100 + "%";
    const rotation = Math.random() * 360; // random starting rotation
    const swayAmount = Math.random() * 50 + 25; // horizontal sway

    arr.push({
      size,
      opacity,
      animationDuration,
      animationDelay,
      left,
      rotation,
      swayAmount,
    });
  }
  return arr;
}

// Snowflake interactions
const onSnowflakeEnter = (index) => {
  hoveredSnowflake.value = index;
};

const onSnowflakeLeave = () => {
  hoveredSnowflake.value = null;
};

// Initialize snow
onMounted(() => {
  snowflakes.value = createSnowflakes(100); // More flakes for dense snowfall

  // Adjust snow density based on screen size
  const updateSnowflakes = () => {
    const count = window.innerWidth < 768 ? 60 : 100;
    if (snowflakes.value.length !== count) {
      snowflakes.value = createSnowflakes(count);
    }
  };

  window.addEventListener("resize", updateSnowflakes);
  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateSnowflakes);
  });
});
</script>

<style scoped>
.snow-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000000;
  overflow: hidden;
}

.snowfall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.snowflake-wrapper {
  position: absolute;
  top: -20px;
  pointer-events: auto;
}

.snowflake {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
  animation-name: snowFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  transform: translate3d(0, 0, 0);
}

.snowflake.paused {
  animation-play-state: paused;
}

.snowflake-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size, 4px);
  height: var(--size, 4px);
  background: #ffffff;
  border-radius: 50%;
  opacity: 0.9;
  box-shadow: 0 0 4px #ffffff, 0 0 8px rgba(255, 255, 255, 0.6);
  transform: rotate(var(--rotation, 0deg));
  transition: all 0.3s ease;
  filter: blur(0.3px);
}

.snowflake-inner.hovered {
  transform: scale(2) rotate(calc(var(--rotation, 0deg) + 180deg));
  opacity: 1 !important;
  box-shadow: 0 0 15px #ffffff, 0 0 30px rgba(255, 255, 255, 0.8);
  filter: blur(0.1px);
  animation: sparkle 0.5s ease-in-out;
}

/* Main falling animation with sway */
@keyframes snowFall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.8);
    transform: translateY(0) translateX(calc(var(--sway, 0px) * 0.1))
      rotate(90deg);
  }
  30% {
    transform: translateY(30vh) translateX(calc(var(--sway, 0px) * 0.3))
      rotate(180deg);
  }
  50% {
    transform: translateY(50vh) translateX(calc(var(--sway, 0px) * 0.5))
      rotate(270deg);
  }
  70% {
    transform: translateY(70vh) translateX(calc(var(--sway, 0px) * 0.7))
      rotate(360deg);
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) translateX(calc(var(--sway, 0px) * 1))
      rotate(450deg);
    opacity: 0;
  }
}

/* Sparkle effect on hover */
@keyframes sparkle {
  0%,
  100% {
    filter: brightness(1) blur(0.1px);
  }
  50% {
    filter: brightness(1.5) blur(0.5px);
  }
}

/* Snow pile accumulation at bottom */
.snow-pile {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 20%,
    transparent 100%
  );
  backdrop-filter: blur(2px);
  pointer-events: none;
}

/* Different snowflake styles for variety */
.snowflake-wrapper:nth-child(3n) .snowflake-inner {
  background: #f0f8ff;
  box-shadow: 0 0 3px #f0f8ff, 0 0 6px rgba(240, 248, 255, 0.5);
}

.snowflake-wrapper:nth-child(5n) .snowflake-inner {
  background: #e6f7ff;
  box-shadow: 0 0 5px #e6f7ff, 0 0 10px rgba(230, 247, 255, 0.4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .snowflake-inner {
    filter: blur(0.2px);
  }

  .snowflake-inner.hovered {
    transform: scale(1.5) rotate(calc(var(--rotation, 0deg) + 180deg));
  }
}

/* Performance optimizations */
.snowflake {
  will-change: transform, opacity;
}

.snowflake-inner {
  will-change: transform, opacity, filter;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .snowflake {
    animation-duration: 20s !important;
    animation-timing-function: ease-in;
  }
}
</style>
