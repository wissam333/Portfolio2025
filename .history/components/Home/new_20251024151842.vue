<template>
  <div
    class="snowfall-container"
    :class="{ 'blizzard-mode': isBlizzard }"
    @click="addSnowflake"
    ref="container"
  >
    <!-- Simplified Background -->
    <div class="night-sky"></div>

    <!-- Optimized Snowflakes -->
    <div class="snowflakes-layer">
      <div
        v-for="snowflake in activeSnowflakes"
        :key="snowflake.id"
        class="snowflake"
        :class="snowflake.size"
        :style="snowflake.style"
      >
        •
      </div>
    </div>

    <!-- Snow Pile -->
    <div class="snow-pile" :style="{ height: `${snowPileHeight}%` }"></div>

    <!-- Simple Moon -->
    <div class="moon" :style="{ opacity: visibilityOpacity }"></div>

    <!-- Minimal Status -->
    <div class="status">
      <div class="status-dot" :class="{ online: isOnline }"></div>
      <div class="status-dot" :class="{ visible: isVisible }"></div>
    </div>

    <!-- Simple Instructions -->
    <div class="instructions">
      <span v-if="isMobile">Shake for blizzard • Tap for snow</span>
      <span v-else>Click for snow • Space for blizzard</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Performance settings
const MAX_SNOWFLAKES = 40;
const BLIZZARD_FLAKES = 25;

// Refs
const activeSnowflakes = ref([]);
const snowPileHeight = ref(15);
const isBlizzard = ref(false);
const isOnline = ref(navigator.onLine);
const isVisible = ref(!document.hidden);
const visibilityOpacity = ref(1);
const isMobile = ref(false);
const container = ref(null);

// Snowflake management
let snowflakeId = 0;
let animationFrame = null;

const createSnowflake = (x = null, isBlizzardFlake = false) => {
  const sizes = ["tiny", "small", "medium"];
  const size = sizes[Math.floor(Math.random() * sizes.length)];

  return {
    id: snowflakeId++,
    x: x !== null ? x : Math.random() * 100,
    y: -5,
    size,
    opacity: 0.3 + Math.random() * 0.7,
    speed: 40, // Normal speed
    drift: 0, // More drift in blizzard
    rotation: 0,
    rotationSpeed: 0,
    isBlizzardFlake,
    style: {},
  };
};

const addSnowflake = (event) => {
  if (activeSnowflakes.value.length >= MAX_SNOWFLAKES) return;

  const rect = container.value.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;

  activeSnowflakes.value.push(createSnowflake(x));

  // Grow snow pile
  if (snowPileHeight.value < 35) {
    snowPileHeight.value += 0.2;
  }
};

// Realistic blizzard effect
const createBlizzard = () => {
  if (isBlizzard.value) return;

  isBlizzard.value = true;

  // Add blizzard snowflakes
  const flakesToAdd = Math.min(
    BLIZZARD_FLAKES,
    MAX_SNOWFLAKES - activeSnowflakes.value.length
  );
  for (let i = 0; i < flakesToAdd; i++) {
    activeSnowflakes.value.push(createSnowflake(null, true));
  }

  // Grow snow pile during blizzard
  snowPileHeight.value = Math.min(snowPileHeight.value + 5, 40);

  setTimeout(() => {
    isBlizzard.value = false;
  }, 2000);
};

// Optimized animation
const animateSnowflakes = () => {
  const now = Date.now();

  activeSnowflakes.value = activeSnowflakes.value.filter((snowflake) => {
    // Update position
    snowflake.y += snowflake.speed;
    snowflake.x += snowflake.drift;
    snowflake.rotation += 0;

    // Wrap around horizontally
    if (snowflake.x > 105) snowflake.x = -5;
    if (snowflake.x < -5) snowflake.x = 105;

    // Update style
    snowflake.style = {
      left: `${snowflake.x}%`,
      top: `${snowflake.y}%`,
      opacity: snowflake.opacity,
      transform: `rotate(${snowflake.rotation}deg)`,
    };

    // Only remove if completely off screen (below 110%)
    return snowflake.y < 110;
  });

  // Add occasional snowflake in normal mode
  if (
    !isBlizzard.value &&
    activeSnowflakes.value.length < MAX_SNOWFLAKES - 5 &&
    Math.random() < 0.1
  ) {
    activeSnowflakes.value.push(createSnowflake());
  }

  animationFrame = requestAnimationFrame(animateSnowflakes);
};

// Device shake detection
let lastAcceleration = { x: 0, y: 0, z: 0 };
let lastShakeTime = 0;

const handleDeviceMotion = (event) => {
  if (!event.accelerationIncludingGravity) return;

  const acc = event.accelerationIncludingGravity;
  if (!acc.x || !acc.y || !acc.z) return;

  const currentTime = Date.now();
  if (currentTime - lastShakeTime < 2000) return;

  const deltaX = Math.abs(acc.x - lastAcceleration.x);
  const deltaY = Math.abs(acc.y - lastAcceleration.y);
  const deltaZ = Math.abs(acc.z - lastAcceleration.z);

  if (deltaX + deltaY + deltaZ > 12) {
    lastShakeTime = currentTime;
    createBlizzard();
  }

  lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
};

// Visibility change
const handleVisibilityChange = () => {
  isVisible.value = !document.hidden;
  visibilityOpacity.value = document.hidden ? 0.3 : 1;
};

// Online/offline
const handleOnline = () => {
  isOnline.value = true;
  // Add a few celebration flakes
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      if (activeSnowflakes.value.length < MAX_SNOWFLAKES) {
        activeSnowflakes.value.push(createSnowflake());
      }
    }, i * 200);
  }
};

const handleOffline = () => {
  isOnline.value = false;
};

// Mobile detection
const checkMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
};

// Keyboard
const handleKeyDown = (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    createBlizzard();
  }
};

// Initialize
onMounted(() => {
  checkMobile();

  // Start with some snowflakes
  for (let i = 0; i < 15; i++) {
    activeSnowflakes.value.push(createSnowflake());
  }

  // Start animation
  animateSnowflakes();

  // Event listeners
  if (typeof DeviceMotionEvent !== "undefined") {
    window.addEventListener("devicemotion", handleDeviceMotion);
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("devicemotion", handleDeviceMotion);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
  window.removeEventListener("keydown", handleKeyDown);

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
.snowfall-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #334155;
  transition: all 0.3s ease;
}

.snowfall-container.blizzard-mode {
  animation: blizzardWind 0.1s ease-in-out infinite;
  filter: brightness(1.1) contrast(1.2);
}

@keyframes blizzardWind {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2px);
  }
}

/* Simplified Background */
.night-sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at top, #1e293b 0%, #0f172a 70%);
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
  will-change: transform;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  transition: transform 0.1s linear;
}

/* Different snowflake sizes using simple dots */
.snowflake.tiny {
  font-size: 12px;
  opacity: 0.4;
  filter: blur(0.3px);
}

.snowflake.small {
  font-size: 16px;
  opacity: 0.7;
  filter: blur(0.2px);
}

.snowflake.medium {
  font-size: 20px;
  opacity: 0.9;
  filter: blur(0.1px);
}

/* Blizzard-specific styles */
.blizzard-mode .snowflake {
  animation: blizzardShake 0.05s ease-in-out infinite;
}

.blizzard-mode .snowflake.tiny {
  opacity: 0.6;
}

.blizzard-mode .snowflake.small {
  opacity: 0.8;
}

.blizzard-mode .snowflake.medium {
  opacity: 1;
}

@keyframes blizzardShake {
  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-1px) rotate(-1deg);
  }
  75% {
    transform: translateX(1px) rotate(1deg);
  }
}

/* Snow Pile */
.snow-pile {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 30%,
    rgba(255, 255, 255, 0.12) 100%
  );
  border-radius: 50% 50% 0 0;
  transition: height 1s ease;
  backdrop-filter: blur(3px);
}

/* Simple Moon */
.moon {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: #f8fafc;
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2),
    inset -3px -3px 5px rgba(0, 0, 0, 0.1);
  transition: opacity 0.5s ease;
}

/* Minimal Status */
.status {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #64748b;
  transition: all 0.3s ease;
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.status-dot.visible {
  background: #3b82f6;
  box-shadow: 0 0 8px #3b82f6;
}

/* Simple Instructions */
.instructions {
  position: absolute;
  bottom: 15px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #cbd5e1;
  font-size: 12px;
  padding: 0 10px;
}

.instructions span {
  background: rgba(15, 23, 42, 0.8);
  padding: 6px 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .snowfall-container {
    height: 300px;
  }

  .moon {
    width: 35px;
    height: 35px;
    top: 20px;
    right: 20px;
  }

  .status {
    top: 15px;
    left: 15px;
  }

  .instructions {
    font-size: 11px;
  }

  .snowflake.tiny {
    font-size: 10px;
  }
  .snowflake.small {
    font-size: 14px;
  }
  .snowflake.medium {
    font-size: 18px;
  }
}

/* Performance optimizations for low-end devices */
@media (max-width: 480px) {
  .snowfall-container {
    height: 250px;
  }

  .snowflake.tiny {
    font-size: 8px;
  }
  .snowflake.small {
    font-size: 12px;
  }
  .snowflake.medium {
    font-size: 16px;
  }

  .blizzard-mode .snowflake {
    animation: none; /* Reduce animations on very low-end devices */
  }
}
</style>
