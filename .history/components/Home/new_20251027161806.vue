<template>
  <div @click="addSnowflake" ref="container" class="snowflakes-container">
    <!-- Snowflakes with optimized rendering -->
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
const MAX_SNOWFLAKES = 80;
const container = ref(null);
let snowflakeId = 0;

const createSnowflake = (x = null, y = null) => {
  const id = snowflakeId++;
  const size = Math.floor(Math.random() * 3); // 0, 1, 2 for different sizes
  return {
    id,
    x: x !== null ? x : Math.random() * 100,
    y: y !== null ? y : -10,
    size,
    opacity: 0.7 + Math.random() * 0.3,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 4,
    fallSpeed: 1 + Math.random() * 2 + size * 0.5,
    drift: (Math.random() - 0.5) * 0.5,
    createdAt: Date.now(),
    style: {},
  };
};

const addSnowflake = (event) => {
  if (activeSnowflakes.value.length >= MAX_SNOWFLAKES) return;

  const rect = container.value.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  const snowflake = createSnowflake(x, y);
  snowflake.fallSpeed *= 1.5; // Make clicked snowflakes fall faster
  activeSnowflakes.value.push(snowflake);
};
// Snowflake animation with requestAnimationFrame
const animateSnowflakes = (timestamp) => {
  // Update snowflakes
  const now = Date.now();
  activeSnowflakes.value = activeSnowflakes.value.filter((snowflake) => {
    // Remove old snowflakes
    if (now - snowflake.createdAt > 8000) {
      return false;
    }

    // Update position and rotation
    snowflake.y += snowflake.fallSpeed * 0.05;
    snowflake.x += snowflake.drift;
    snowflake.rotation += snowflake.rotationSpeed;

    // Wrap around horizontally
    if (snowflake.x > 105) snowflake.x = -5;
    if (snowflake.x < -5) snowflake.x = 105;

    // Update style efficiently
    snowflake.style = {
      left: `${snowflake.x}%`,
      top: `${snowflake.y}%`,
      opacity: snowflake.opacity,
      transform: `rotate(${snowflake.rotation}deg)`,
      transition: "none",
    };

    return snowflake.y < 110; // Remove if fallen too far
  });

  requestAnimationFrame(animateSnowflakes);
};

onMounted(() => {
  requestAnimationFrame(animateSnowflakes);
});
</script>
<style lang="scss" scoped>
.snowflakes-container {
  height: 20vh;
  z-index: 10;
}
/* Optimized Snowflakes */
.snowflakes-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.snowflake {
  position: absolute;
  color: white;
  user-select: none;
  pointer-events: none;
  will-change: transform, opacity;
  transition: transform 0.1s linear;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3));
}

.snowflake.size-0 {
  font-size: 14px;
  opacity: 0.6;
}

.snowflake.size-1 {
  font-size: 18px;
  opacity: 0.8;
}

.snowflake.size-2 {
  font-size: 22px;
  opacity: 1;
}
</style>
