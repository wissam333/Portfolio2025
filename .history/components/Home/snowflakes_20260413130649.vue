<template>
  <div @click="addSnowflake" ref="container" class="snowflakes-container star1">
    <div class="snowflakes-layer">
      <div
        v-for="snowflake in activeSnowflakes"
        :key="snowflake.id"
        class="snowflake"
        :class="`size-${snowflake.size}`"
        :style="snowflake.style"
      >
        ❄
      </div>
    </div>
  </div>
</template>

<script setup>
const activeSnowflakes = ref([]);
const MAX_SNOWFLAKES = 10;
let snowflakeId = 0;
let rafId = null;

const createSnowflake = (x, y) => ({
  id: snowflakeId++,
  x,
  y,
  size: Math.floor(Math.random() * 3),
  opacity: 0.7 + Math.random() * 0.3,
  rotation: Math.random() * 360,
  rotationSpeed: (Math.random() - 0.5) * 4,
  fallSpeed:
    (1 + Math.random() * 2 + Math.floor(Math.random() * 3) * 0.5) * 1.5,
  drift: (Math.random() - 0.5) * 0.5,
  createdAt: Date.now(),
  style: {},
});

const addSnowflake = (event) => {
  if (activeSnowflakes.value.length >= MAX_SNOWFLAKES) return;

  const y = event.clientY / window.innerHeight;
  if (y > 0.2) return;

  if (!useEasterEggs().value.includes(7)) {
    useEasterEggs().value.push(7);
  }

  const x = (event.clientX / window.innerWidth) * 100;
  activeSnowflakes.value.push(createSnowflake(x, y));
};

const tick = () => {
  const now = Date.now();
  const next = [];

  for (const sf of activeSnowflakes.value) {
    if (now - sf.createdAt > 10000) continue;

    sf.y += sf.fallSpeed * 0.05;
    sf.x += sf.drift;
    sf.rotation += sf.rotationSpeed;

    if (sf.x > 105) sf.x = -5;
    else if (sf.x < -5) sf.x = 105;

    if (sf.y >= 120) continue;

    sf.style = {
      left: `${sf.x}%`,
      top: `${sf.y}vh`,
      opacity: sf.opacity,
      transform: `rotate(${sf.rotation}deg)`,
      transition: "none",
    };

    next.push(sf);
  }

  activeSnowflakes.value = next;
  rafId = requestAnimationFrame(tick);
};

onMounted(() => {
  rafId = requestAnimationFrame(tick);
});
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style lang="scss" scoped>
.snowflakes-container {
  height: 20vh;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent;
  z-index: 15;
  cursor: pointer;
}

.snowflakes-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 15;
  overflow: visible;
}

.snowflake {
  position: absolute;
  color: white;
  user-select: none;
  pointer-events: none;
  will-change: transform, opacity;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3));
  z-index: 13;

  &.size-0 {
    font-size: 14px;
    opacity: 0.6;
  }
  &.size-1 {
    font-size: 18px;
    opacity: 0.8;
  }
  &.size-2 {
    font-size: 22px;
    opacity: 1;
  }
}
</style>
