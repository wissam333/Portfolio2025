<template>
  <div
    class="snow-globe"
    :class="{ 'shake-mode': isShaking, 'tab-hidden': !isVisible }"
    @click="addSnowflake"
    ref="container"
  >
    <!-- Snow Globe Container -->
    <div class="globe-container">
      <!-- Glass Effect -->
      <div class="glass"></div>

      <!-- Base -->
      <div class="base"></div>

      <!-- Snowflakes -->
      <div class="snowflakes-container">
        <div
          v-for="snowflake in activeSnowflakes"
          :key="snowflake.id"
          class="snowflake"
          :class="snowflake.size"
          :style="snowflake.style"
        >
          ❄
        </div>
      </div>

      <!-- Snow Ground -->
      <div
        class="snow-ground"
        :style="{ transform: `translateY(${snowGroundOffset}px)` }"
      >
        <div class="snow-sparkle" v-for="n in 3" :key="n"></div>
      </div>

      <!-- Scene Inside -->
      <div class="scene">
        <div
          class="tree"
          v-for="tree in trees"
          :key="tree.id"
          :style="tree.style"
        ></div>
        <div class="house"></div>
      </div>
    </div>

    <!-- Simple Status -->
    <div class="status">
      <div
        class="status-dot"
        :class="{ online: isOnline }"
        title="Connection"
      ></div>
      <div
        class="status-dot"
        :class="{ visible: isVisible }"
        title="Visibility"
      ></div>
    </div>

    <!-- Instructions -->
    <div class="instructions">
      <span>{{
        isMobile ? "Shake phone or tap" : "Press space or click"
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Performance settings
const MAX_SNOWFLAKES = 35;
const SHAKE_INTENSITY = 20;

// Refs
const activeSnowflakes = ref([]);
const snowGroundOffset = ref(0);
const isShaking = ref(false);
const isOnline = ref(navigator.onLine);
const isVisible = ref(!document.hidden);
const isMobile = ref(false);
const container = ref(null);
const trees = ref([]);

// Snowflake management
let snowflakeId = 0;
let animationFrame = null;
let lastShakeTime = 0;

const createSnowflake = (isStormFlake = false) => {
  const sizes = ["tiny", "small", "medium"];
  const size = sizes[Math.floor(Math.random() * sizes.length)];

  const baseSpeed = isStormFlake
    ? 2 + Math.random() * 3 // Faster during shake
    : 0.8 + Math.random() * 1.2; // Normal speed

  return {
    id: snowflakeId++,
    x: Math.random() * 100,
    y: -10,
    size,
    opacity: 0.6 + Math.random() * 0.4,
    speed: baseSpeed,
    drift: (Math.random() - 0.5) * (isStormFlake ? 1.5 : 0.8),
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * (isStormFlake ? 8 : 4),
    isFalling: true,
    style: {},
  };
};

const addSnowflake = (event) => {
  if (activeSnowflakes.value.length >= MAX_SNOWFLAKES) return;

  const rect = container.value.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;

  const snowflake = createSnowflake();
  snowflake.x = x;
  snowflake.speed *= 1.3; // Make clicked snowflakes fall faster
  activeSnowflakes.value.push(snowflake);
};

// Realistic snow globe shake effect
const shakeGlobe = () => {
  if (isShaking.value) return;

  isShaking.value = true;
  snowGroundOffset.value = 5; // Lift snow ground

  // Create storm effect - more snowflakes with varied properties
  const flakesToAdd = Math.min(
    20,
    MAX_SNOWFLAKES - activeSnowflakes.value.length
  );
  for (let i = 0; i < flakesToAdd; i++) {
    setTimeout(() => {
      if (activeSnowflakes.value.length < MAX_SNOWFLAKES) {
        const stormFlake = createSnowflake(true);
        // Start from random positions during shake
        stormFlake.y = Math.random() * 80;
        activeSnowflakes.value.push(stormFlake);
      }
    }, i * 30);
  }

  // Settle down after shake
  setTimeout(() => {
    isShaking.value = false;
    snowGroundOffset.value = 0;
  }, 1200);
};

// Optimized animation loop
const animate = () => {
  activeSnowflakes.value.forEach((snowflake) => {
    if (snowflake.isFalling) {
      // Update position with gravity-like effect
      snowflake.y += snowflake.speed * 0.04;
      snowflake.x += snowflake.drift;
      snowflake.rotation += snowflake.rotationSpeed;

      // Check if hit ground (85% from top is ground level)
      if (snowflake.y > 85) {
        snowflake.isFalling = false;
        snowflake.speed = 0;
        snowflake.drift = 0;
        snowflake.rotationSpeed = 0;
      }

      // Wrap around sides
      if (snowflake.x > 105) snowflake.x = -5;
      if (snowflake.x < -5) snowflake.x = 105;

      // Update style
      snowflake.style = {
        left: `${snowflake.x}%`,
        top: `${snowflake.y}%`,
        opacity: snowflake.opacity,
        transform: `rotate(${snowflake.rotation}deg)`,
      };
    }
  });

  // Remove oldest snowflake if we have too many (only non-falling ones)
  if (activeSnowflakes.value.length > MAX_SNOWFLAKES) {
    const settledFlakeIndex = activeSnowflakes.value.findIndex(
      (flake) => !flake.isFalling
    );
    if (settledFlakeIndex !== -1) {
      activeSnowflakes.value.splice(settledFlakeIndex, 1);
    }
  }

  animationFrame = requestAnimationFrame(animate);
};

// Device motion with realistic shake detection
let lastAcceleration = { x: 0, y: 0, z: 0 };

const handleDeviceMotion = (event) => {
  if (!event.accelerationIncludingGravity) return;

  const acc = event.accelerationIncludingGravity;
  if (!acc.x || !acc.y || !acc.z) return;

  const currentTime = Date.now();
  if (currentTime - lastShakeTime < 1500) return;

  const deltaX = Math.abs(acc.x - lastAcceleration.x);
  const deltaY = Math.abs(acc.y - lastAcceleration.y);
  const deltaZ = Math.abs(acc.z - lastAcceleration.z);

  // More sensitive shake detection for snow globe
  if (deltaX + deltaY + deltaZ > SHAKE_INTENSITY) {
    lastShakeTime = currentTime;
    shakeGlobe();
  }

  lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
};

// Browser APIs
const handleVisibilityChange = () => {
  isVisible.value = !document.hidden;
};

const handleOnline = () => {
  isOnline.value = true;
  // Gentle celebration
  for (let i = 0; i < 2; i++) {
    setTimeout(() => addSnowflake({ clientX: 100, clientY: 100 }), i * 200);
  }
};

const handleOffline = () => {
  isOnline.value = false;
};

const checkMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
};

const handleKeyDown = (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    shakeGlobe();
  }
};

// Initialize trees
const initializeScene = () => {
  trees.value = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    style: {
      left: `${15 + i * 25}%`,
      height: `${40 + Math.random() * 20}px`,
    },
  }));
};

// Auto-add occasional snowflake
let snowInterval;

onMounted(() => {
  checkMobile();
  initializeScene();

  // Start with gentle snowfall
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      activeSnowflakes.value.push(createSnowflake());
    }, i * 200);
  }

  // Start animation
  animate();

  // Event listeners
  if (typeof DeviceMotionEvent !== "undefined") {
    window.addEventListener("devicemotion", handleDeviceMotion);
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  window.addEventListener("keydown", handleKeyDown);

  // Gentle auto snowfall
  snowInterval = setInterval(() => {
    if (
      activeSnowflakes.value.length < MAX_SNOWFLAKES - 5 &&
      Math.random() < 0.3
    ) {
      activeSnowflakes.value.push(createSnowflake());
    }
  }, 800);
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
  clearInterval(snowInterval);
});
</script>

<style scoped>
.snow-globe {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.snow-globe.tab-hidden {
  filter: brightness(0.7);
}

.snow-globe.shake-mode {
  animation: globeShake 0.8s ease-in-out;
}

@keyframes globeShake {
  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-8px) rotate(-1deg);
  }
  50% {
    transform: translateX(8px) rotate(1deg);
  }
  75% {
    transform: translateX(-4px) rotate(-0.5deg);
  }
}

/* Snow Globe Container */
.globe-container {
  position: relative;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Glass Dome */
.glass {
  position: absolute;
  top: 0;
  width: 280px;
  height: 280px;
  background: radial-gradient(
    circle at 50% 40%,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    transparent 70%
  );
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.2),
    0 0 30px rgba(255, 255, 255, 0.1);
  z-index: 2;
  pointer-events: none;
}

/* Base */
.base {
  position: absolute;
  bottom: 0;
  width: 200px;
  height: 60px;
  background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
  border-radius: 10px 10px 20px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 -5px 10px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* Snowflakes Container */
.snowflakes-container {
  position: absolute;
  top: 20px;
  width: 260px;
  height: 240px;
  pointer-events: none;
  z-index: 3;
}

.snowflake {
  position: absolute;
  color: white;
  user-select: none;
  pointer-events: none;
  will-change: transform;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
  transition: transform 0.1s linear, top 0.1s linear, left 0.1s linear;
}

.snowflake.tiny {
  font-size: 14px;
  opacity: 0.6;
  filter: blur(0.3px);
}

.snowflake.small {
  font-size: 18px;
  opacity: 0.8;
  filter: blur(0.2px);
}

.snowflake.medium {
  font-size: 22px;
  opacity: 1;
  filter: blur(0.1px);
}

/* Snow Ground */
.snow-ground {
  position: absolute;
  bottom: 60px;
  width: 260px;
  height: 80px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 100%
  );
  border-radius: 50% 50% 0 0;
  transition: transform 0.5s ease;
  z-index: 2;
}

.snow-sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: sparkle 3s ease-in-out infinite;
}

.snow-sparkle:nth-child(1) {
  left: 25%;
  top: 30%;
  animation-delay: 0s;
}
.snow-sparkle:nth-child(2) {
  left: 60%;
  top: 50%;
  animation-delay: 1s;
}
.snow-sparkle:nth-child(3) {
  left: 45%;
  top: 20%;
  animation-delay: 2s;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Scene Inside */
.scene {
  position: absolute;
  bottom: 60px;
  width: 260px;
  height: 220px;
  z-index: 1;
}

.tree {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 40px solid #2d5a27;
  transition: height 0.3s ease;
}

.tree::before {
  content: "";
  position: absolute;
  top: -20px;
  left: -12px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 30px solid #3a6b32;
}

.tree::after {
  content: "";
  position: absolute;
  top: -40px;
  left: -9px;
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 20px solid #47803c;
}

.house {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 30px;
  background: #8b4513;
}

.house::before {
  content: "";
  position: absolute;
  top: -15px;
  left: -5px;
  width: 50px;
  height: 20px;
  background: #a52a2a;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* Status */
.status {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #64748b;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 2s infinite;
}

.status-dot.visible {
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Instructions */
.instructions {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 10;
}

.instructions span {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .snow-globe {
    height: 400px;
  }

  .globe-container {
    transform: scale(0.8);
  }

  .instructions span {
    font-size: 12px;
    padding: 6px 12px;
  }

  .snowflake.tiny {
    font-size: 12px;
  }
  .snowflake.small {
    font-size: 16px;
  }
  .snowflake.medium {
    font-size: 20px;
  }
}

/* Performance optimizations */
@media (max-width: 480px) {
  .globe-container {
    transform: scale(0.7);
  }

  .snowflakes-container {
    transform: scale(0.9);
  }
}
</style>
