<template>
  <div
    class="snowfall-container"
    :class="{ 'tab-hidden': !isVisible, 'shake-effect': isShaking }"
    @click="addSnowflake"
    ref="container"
  >
    <!-- Animated Background -->
    <div class="night-sky">
      <div
        class="star"
        v-for="star in stars"
        :key="star.id"
        :style="star.style"
      ></div>
    </div>

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

    <!-- Interactive Snow Pile -->
    <div class="snow-pile" :style="{ height: `${snowPileHeight}%` }">
      <div
        class="snow-sparkle"
        v-for="n in visibleSparkles"
        :key="`sparkle-${n}`"
      ></div>
    </div>

    <!-- Moon with professional animation -->
    <div
      class="moon"
      :style="{
        opacity: visibilityOpacity,
        transform: `scale(${isVisible ? 1 : 0.8}) rotate(${moonRotation}deg)`,
      }"
    >
      <div class="moon-glow"></div>
    </div>

    <!-- Professional Status Panel -->
    <div class="status-panel">
      <div class="status-item" :class="{ online: isOnline }">
        <div class="status-icon">
          <div class="signal-bars"></div>
        </div>
        <span class="status-text">{{
          isOnline ? "Connected" : "Offline"
        }}</span>
      </div>
      <div class="status-item" :class="{ visible: isVisible }">
        <div class="status-icon">
          <div class="eye"></div>
        </div>
        <span class="status-text">{{ isVisible ? "Visible" : "Hidden" }}</span>
      </div>
      <div class="status-item" :class="{ shaking: isShaking }">
        <div class="status-icon">
          <div class="shake-icon"></div>
        </div>
        <span class="status-text">{{ isShaking ? "Blizzard!" : "Calm" }}</span>
      </div>
    </div>

    <!-- Elegant Instructions -->
    <div class="instructions">
      <div class="instruction-card">
        <p v-if="isMobile">📱 Shake for blizzard • Tap for snow</p>
        <p v-else>🖱️ Click for snow • Space for blizzard</p>
      </div>
    </div>

    <!-- Performance Stats (dev only) -->
    <div class="performance-stats" v-if="showPerformance">
      Snowflakes: {{ activeSnowflakes.length }} | FPS: {{ fps }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Performance optimization
const MAX_SNOWFLAKES = 80;
const SNOWFLAKE_LIFETIME = 8000; // 8 seconds

// Refs
const snowflakes = ref([]);
const activeSnowflakes = ref([]);
const snowPileHeight = ref(15);
const isShaking = ref(false);
const isOnline = ref(navigator.onLine);
const isVisible = ref(!document.hidden);
const visibilityOpacity = ref(1);
const isMobile = ref(false);
const moonRotation = ref(0);
const visibleSparkles = ref(3);
const showPerformance = ref(false);
const fps = ref(0);
const container = ref(null);

// Snowflake management with performance
let snowflakeId = 0;
let lastFrameTime = 0;
let frameCount = 0;
let lastFpsUpdate = 0;

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

  // Grow snow pile gradually
  if (snowPileHeight.value < 35) {
    snowPileHeight.value += 0.3;
  }
};

const createBlizzard = () => {
  if (isShaking.value) return;

  isShaking.value = true;
  visibleSparkles.value = 8; // More sparkles during blizzard

  // Add multiple snowflakes with controlled count
  const flakesToAdd = Math.min(
    15,
    MAX_SNOWFLAKES - activeSnowflakes.value.length
  );
  for (let i = 0; i < flakesToAdd; i++) {
    setTimeout(() => {
      if (activeSnowflakes.value.length < MAX_SNOWFLAKES) {
        activeSnowflakes.value.push(createSnowflake());
      }
    }, i * 50);
  }

  // Grow snow pile faster during blizzard
  snowPileHeight.value = Math.min(snowPileHeight.value + 8, 35);

  setTimeout(() => {
    isShaking.value = false;
    visibleSparkles.value = 3;
  }, 1500);
};

// Snowflake animation with requestAnimationFrame
const animateSnowflakes = (timestamp) => {
  // FPS calculation
  frameCount++;
  if (timestamp >= lastFpsUpdate + 1000) {
    fps.value = Math.round((frameCount * 1000) / (timestamp - lastFpsUpdate));
    frameCount = 0;
    lastFpsUpdate = timestamp;
  }

  // Update snowflakes
  const now = Date.now();
  activeSnowflakes.value = activeSnowflakes.value.filter((snowflake) => {
    // Remove old snowflakes
    if (now - snowflake.createdAt > SNOWFLAKE_LIFETIME) {
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

// Device shake detection with debouncing
let lastAcceleration = { x: 0, y: 0, z: 0 };
let lastShakeTime = 0;
const SHAKE_COOLDOWN = 2000; // 2 seconds between shakes

const handleDeviceMotion = (event) => {
  if (!event.accelerationIncludingGravity) return;

  const acc = event.accelerationIncludingGravity;
  if (!acc.x || !acc.y || !acc.z) return;

  const currentTime = Date.now();
  if (currentTime - lastShakeTime < SHAKE_COOLDOWN) return;

  const deltaX = Math.abs(acc.x - lastAcceleration.x);
  const deltaY = Math.abs(acc.y - lastAcceleration.y);
  const deltaZ = Math.abs(acc.z - lastAcceleration.z);

  if (deltaX + deltaY + deltaZ > 15) {
    lastShakeTime = currentTime;
    createBlizzard();
  }

  lastAcceleration = {
    x: acc.x,
    y: acc.y,
    z: acc.z,
  };
};

// Visibility change handler
const handleVisibilityChange = () => {
  isVisible.value = !document.hidden;
  visibilityOpacity.value = document.hidden ? 0.4 : 1;
};

// Online/offline handlers
const handleOnline = () => {
  isOnline.value = true;
  // Subtle celebration - add a few special snowflakes
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      if (activeSnowflakes.value.length < MAX_SNOWFLAKES) {
        const specialFlake = createSnowflake();
        specialFlake.fallSpeed *= 2;
        specialFlake.opacity = 1;
        activeSnowflakes.value.push(specialFlake);
      }
    }, i * 300);
  }
};

const handleOffline = () => {
  isOnline.value = false;
};

// Detect mobile device
const checkMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
};

// Keyboard support
const handleKeyDown = (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    createBlizzard();
  } else if (event.code === "KeyP") {
    // Toggle performance stats with P key
    showPerformance.value = !showPerformance.value;
  }
};

// Stars for background
const stars = ref([]);
const initializeStars = () => {
  stars.value = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    },
  }));
};

// Moon rotation animation
const animateMoon = () => {
  moonRotation.value = (moonRotation.value + 0.1) % 360;
  requestAnimationFrame(animateMoon);
};

// Auto-add snowflakes with controlled rate
let snowInterval;

// Lifecycle
onMounted(() => {
  initializeStars();
  checkMobile();

  // Initial snowflakes
  for (let i = 0; i < 20; i++) {
    activeSnowflakes.value.push(createSnowflake());
  }

  // Start animations
  requestAnimationFrame(animateSnowflakes);
  requestAnimationFrame(animateMoon);

  // Event listeners
  if (typeof DeviceMotionEvent !== "undefined") {
    window.addEventListener("devicemotion", handleDeviceMotion);
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  window.addEventListener("keydown", handleKeyDown);

  // Controlled auto snowfall
  snowInterval = setInterval(() => {
    if (activeSnowflakes.value.length < MAX_SNOWFLAKES - 10) {
      activeSnowflakes.value.push(createSnowflake());
    }
  }, 500);
});

onUnmounted(() => {
  window.removeEventListener("devicemotion", handleDeviceMotion);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
  window.removeEventListener("keydown", handleKeyDown);
  clearInterval(snowInterval);
});
</script>

<style scoped>
.snowfall-container {
  position: relative;
  width: 100%;
  height: 500px;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #334155;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.snowfall-container.tab-hidden {
  filter: brightness(0.6) saturate(0.8);
}

.snowfall-container.shake-effect {
  animation: containerShake 0.8s ease-in-out;
}

@keyframes containerShake {
  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-6px) rotate(-0.5deg);
  }
  75% {
    transform: translateX(6px) rotate(0.5deg);
  }
}

/* Night Sky with Stars */
.night-sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle linear infinite;
  opacity: 0;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
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

/* Snow Pile */
.snow-pile {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 60% 60% 0 0;
  transition: height 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
}

.snow-sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  animation: sparkleTwinkle 4s ease-in-out infinite;
  filter: blur(0.5px);
}

.snow-sparkle:nth-child(1) {
  left: 20%;
  top: 30%;
  animation-delay: 0s;
}
.snow-sparkle:nth-child(2) {
  left: 50%;
  top: 20%;
  animation-delay: 1.3s;
}
.snow-sparkle:nth-child(3) {
  left: 80%;
  top: 40%;
  animation-delay: 2.7s;
}
.snow-sparkle:nth-child(4) {
  left: 30%;
  top: 60%;
  animation-delay: 0.8s;
}
.snow-sparkle:nth-child(5) {
  left: 70%;
  top: 50%;
  animation-delay: 3.5s;
}
.snow-sparkle:nth-child(6) {
  left: 40%;
  top: 25%;
  animation-delay: 2.1s;
}
.snow-sparkle:nth-child(7) {
  left: 60%;
  top: 35%;
  animation-delay: 1.7s;
}
.snow-sparkle:nth-child(8) {
  left: 10%;
  top: 45%;
  animation-delay: 0.4s;
}

@keyframes sparkleTwinkle {
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

/* Professional Moon */
.moon {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.15),
    inset -5px -5px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.moon-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: moonPulse 4s ease-in-out infinite;
}

@keyframes moonPulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Professional Status Panel */
.status-panel {
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #334155;
  border-radius: 16px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.status-item.online {
  color: #10b981;
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.status-item.visible {
  color: #3b82f6;
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.status-item.shaking {
  color: #ef4444;
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  animation: statusPulse 0.6s ease-in-out infinite;
}

.status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signal-bars,
.eye,
.shake-icon {
  width: 16px;
  height: 16px;
  position: relative;
}

/* Status Icons */
.signal-bars::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 3px;
  height: 16px;
  background: currentColor;
  border-radius: 1px;
}

.signal-bars::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 5px;
  width: 3px;
  height: 12px;
  background: currentColor;
  border-radius: 1px;
}

.eye::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border: 2px solid currentColor;
  border-radius: 50%;
}

.shake-icon::before {
  content: "↔";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}

@keyframes statusPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Elegant Instructions */
.instructions {
  position: absolute;
  bottom: 25px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.instruction-card {
  padding: 12px 24px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid #334155;
  border-radius: 16px;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.instruction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

/* Performance Stats */
.performance-stats {
  position: absolute;
  bottom: 80px;
  right: 20px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: #10b981;
  font-size: 11px;
  font-family: "Courier New", monospace;
  border-radius: 8px;
  z-index: 10;
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .snowfall-container {
    height: 400px;
    border-radius: 16px;
  }

  .moon {
    width: 50px;
    height: 50px;
    top: 25px;
    right: 25px;
  }

  .status-panel {
    top: 20px;
    left: 20px;
    gap: 8px;
  }

  .status-item {
    padding: 8px 12px;
    font-size: 11px;
    gap: 8px;
  }

  .instruction-card {
    font-size: 12px;
    padding: 10px 16px;
  }

  .snowflake.size-0 {
    font-size: 12px;
  }
  .snowflake.size-1 {
    font-size: 15px;
  }
  .snowflake.size-2 {
    font-size: 18px;
  }
}
</style>
