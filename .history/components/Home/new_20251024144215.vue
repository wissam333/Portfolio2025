<template>
  <div
    class="snowfall-container"
    :class="{ 'tab-hidden': !isVisible, 'shake-effect': isShaking }"
    @click="addSnowflake"
  >
    <!-- Snowflakes -->
    <div
      v-for="(snowflake, index) in snowflakes"
      :key="index"
      class="snowflake"
      :style="{
        left: `${snowflake.x}%`,
        top: `${snowflake.y}%`,
        opacity: snowflake.opacity,
        transform: `scale(${snowflake.scale}) rotate(${snowflake.rotation}deg)`,
        animationDuration: `${snowflake.duration}s`,
        animationDelay: `${snowflake.delay}s`,
      }"
    >
      ❄
    </div>

    <!-- Interactive Snow Pile -->
    <div class="snow-pile" :style="{ height: `${snowPileHeight}%` }">
      <div class="snow-sparkle" v-for="n in 5" :key="`sparkle-${n}`"></div>
    </div>

    <!-- Moon with visibility effect -->
    <div
      class="moon"
      :style="{
        opacity: visibilityOpacity,
        transform: `scale(${isVisible ? 1 : 0.8})`,
      }"
    >
      <div class="moon-crater" v-for="n in 3" :key="`crater-${n}`"></div>
    </div>

    <!-- Status Indicators -->
    <div class="status-panel">
      <div class="status-item" :class="{ online: isOnline }">
        <span class="status-dot"></span>
        {{ isOnline ? "Connected" : "Offline" }}
      </div>
      <div class="status-item" :class="{ visible: isVisible }">
        <span class="status-dot"></span>
        {{ isVisible ? "Tab Active" : "Tab Hidden" }}
      </div>
      <div class="status-item" :class="{ shaking: isShaking }">
        <span class="status-dot"></span>
        {{ isShaking ? "Shaking!" : "Ready" }}
      </div>
    </div>

    <!-- Instructions -->
    <div class="instructions">
      <p v-if="isMobile">📱 Shake to create blizzard • Tap to add snowflakes</p>
      <p v-else>
        🖱️ Click to add snowflakes • Press Space for blizzard • Switch tabs to
        dim moon
      </p>
    </div>

    <!-- Connection celebration -->
    <div v-if="showConnectionCelebration" class="celebration">
      <div class="celebration-flake" v-for="n in 8" :key="`celebrate-${n}`">
        ❄
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Snowflake management
interface Snowflake {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
  duration: number;
  delay: number;
}

const snowflakes = ref<Snowflake[]>([]);
const snowPileHeight = ref(10);
const isShaking = ref(false);
const isOnline = ref(navigator.onLine);
const isVisible = ref(!document.hidden);
const visibilityOpacity = ref(1);
const isMobile = ref(false);
const showConnectionCelebration = ref(false);

// Initialize snowfall
const initializeSnowfall = () => {
  snowflakes.value = Array.from({ length: 30 }, () => createSnowflake());
};

const createSnowflake = (): Snowflake => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  opacity: 0.3 + Math.random() * 0.7,
  scale: 0.5 + Math.random() * 0.5,
  rotation: Math.random() * 360,
  duration: 5 + Math.random() * 10,
  delay: Math.random() * 5,
});

// Add snowflake on click
const addSnowflake = (event: MouseEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  snowflakes.value.push({
    x,
    y: y - 10,
    opacity: 1,
    scale: 0.8,
    rotation: 0,
    duration: 4,
    delay: 0,
  });

  // Grow snow pile
  if (snowPileHeight.value < 40) {
    snowPileHeight.value += 0.5;
  }

  // Remove oldest snowflake if we have too many
  if (snowflakes.value.length > 50) {
    snowflakes.value.shift();
  }
};

// Shake to create blizzard
const createBlizzard = () => {
  isShaking.value = true;

  // Add multiple snowflakes
  for (let i = 0; i < 15; i++) {
    snowflakes.value.push(createSnowflake());
  }

  // Grow snow pile faster during blizzard
  snowPileHeight.value = Math.min(snowPileHeight.value + 5, 40);

  setTimeout(() => {
    isShaking.value = false;
  }, 1000);
};

// Device shake detection
let lastAcceleration = { x: 0, y: 0, z: 0 };
const shakeThreshold = 20;

const handleDeviceMotion = (event: DeviceMotionEvent) => {
  if (!event.accelerationIncludingGravity) return;

  const acceleration = event.accelerationIncludingGravity;
  if (!acceleration.x || !acceleration.y || !acceleration.z) return;

  const deltaX = Math.abs(acceleration.x - lastAcceleration.x);
  const deltaY = Math.abs(acceleration.y - lastAcceleration.y);
  const deltaZ = Math.abs(acceleration.z - lastAcceleration.z);

  if (deltaX + deltaY + deltaZ > shakeThreshold) {
    createBlizzard();
  }

  lastAcceleration = {
    x: acceleration.x,
    y: acceleration.y,
    z: acceleration.z,
  };
};

// Visibility change handler
const handleVisibilityChange = () => {
  isVisible.value = !document.hidden;
  visibilityOpacity.value = document.hidden ? 0.3 : 1;
};

// Online/offline handlers
const handleOnline = () => {
  isOnline.value = true;
  showConnectionCelebration.value = true;

  // Add celebration snowflakes
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      snowflakes.value.push(createSnowflake());
    }, i * 100);
  }

  setTimeout(() => {
    showConnectionCelebration.value = false;
  }, 3000);
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

// Keyboard support for desktop
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.code === "Space") {
    event.preventDefault();
    createBlizzard();
  }
};

// Auto-add snowflakes occasionally
let snowInterval: NodeJS.Timeout;

// Lifecycle
onMounted(() => {
  initializeSnowfall();
  checkMobile();

  // Event listeners
  if (typeof DeviceMotionEvent !== "undefined") {
    window.addEventListener("devicemotion", handleDeviceMotion);
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  window.addEventListener("keydown", handleKeyDown);

  // Auto snowfall
  snowInterval = setInterval(() => {
    if (snowflakes.value.length < 40) {
      snowflakes.value.push(createSnowflake());
    }
  }, 1000);
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
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #334155;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.snowfall-container.tab-hidden {
  filter: brightness(0.7);
}

.snowfall-container.shake-effect {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8px);
  }
  75% {
    transform: translateX(8px);
  }
}

/* Snowflakes */
.snowflake {
  position: absolute;
  color: white;
  font-size: 1.2em;
  user-select: none;
  pointer-events: none;
  animation: fall linear infinite;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
  z-index: 2;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(420px) rotate(360deg);
    opacity: 0;
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
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 50% 50% 0 0;
  transition: height 1s ease;
  z-index: 1;
}

.snow-sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: sparkle 3s infinite;
  filter: blur(1px);
}

.snow-sparkle:nth-child(1) {
  left: 20%;
  top: 30%;
  animation-delay: 0s;
}
.snow-sparkle:nth-child(2) {
  left: 50%;
  top: 20%;
  animation-delay: 1s;
}
.snow-sparkle:nth-child(3) {
  left: 80%;
  top: 40%;
  animation-delay: 2s;
}
.snow-sparkle:nth-child(4) {
  left: 30%;
  top: 60%;
  animation-delay: 1.5s;
}
.snow-sparkle:nth-child(5) {
  left: 70%;
  top: 50%;
  animation-delay: 0.5s;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Moon */
.moon {
  position: absolute;
  top: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
  transition: all 0.5s ease;
  z-index: 1;
}

.moon-crater {
  position: absolute;
  background: rgba(200, 200, 200, 0.3);
  border-radius: 50%;
}

.moon-crater:nth-child(1) {
  width: 12px;
  height: 12px;
  top: 15px;
  left: 20px;
}

.moon-crater:nth-child(2) {
  width: 8px;
  height: 8px;
  top: 35px;
  left: 15px;
}

.moon-crater:nth-child(3) {
  width: 10px;
  height: 10px;
  top: 25px;
  left: 40px;
}

/* Status Panel */
.status-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 3;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #334155;
  border-radius: 20px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.status-item.online {
  color: #4ade80;
  border-color: #4ade80;
}

.status-item.visible {
  color: #60a5fa;
  border-color: #60a5fa;
}

.status-item.shaking {
  color: #f87171;
  border-color: #f87171;
  animation: pulse 0.5s infinite;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Instructions */
.instructions {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #cbd5e1;
  font-size: 14px;
  z-index: 3;
}

.instructions p {
  margin: 0;
  padding: 8px 16px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 20px;
  display: inline-block;
  backdrop-filter: blur(10px);
}

/* Celebration */
.celebration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

.celebration-flake {
  position: absolute;
  font-size: 2em;
  color: #60a5fa;
  animation: celebrate 2s ease-out forwards;
}

.celebration-flake:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
}
.celebration-flake:nth-child(2) {
  left: 30%;
  animation-delay: 0.1s;
}
.celebration-flake:nth-child(3) {
  left: 50%;
  animation-delay: 0.2s;
}
.celebration-flake:nth-child(4) {
  left: 70%;
  animation-delay: 0.3s;
}
.celebration-flake:nth-child(5) {
  left: 90%;
  animation-delay: 0.4s;
}
.celebration-flake:nth-child(6) {
  left: 20%;
  animation-delay: 0.5s;
}
.celebration-flake:nth-child(7) {
  left: 40%;
  animation-delay: 0.6s;
}
.celebration-flake:nth-child(8) {
  left: 60%;
  animation-delay: 0.7s;
}

@keyframes celebrate {
  0% {
    transform: translateY(100%) scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
    transform: translateY(50%) scale(1) rotate(180deg);
  }
  100% {
    transform: translateY(0) scale(1.5) rotate(360deg);
    opacity: 0;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .snowfall-container {
    height: 400px;
  }

  .moon {
    width: 40px;
    height: 40px;
    top: 20px;
    right: 20px;
  }

  .instructions p {
    font-size: 12px;
  }

  .status-panel {
    top: 15px;
    left: 15px;
  }

  .status-item {
    font-size: 11px;
    padding: 4px 10px;
  }
}
</style>
