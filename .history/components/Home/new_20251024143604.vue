<template>
  <div class="zen-garden" :class="{ 'mobile-shake': isShaking }">
    <!-- Background elements -->
    <div class="sky"></div>
    <div class="ground"></div>

    <!-- Interactive elements -->
    <div
      v-for="(rock, index) in rocks"
      :key="index"
      class="rock"
      :style="{
        left: `${rock.x}%`,
        top: `${rock.y}%`,
        transform: `rotate(${rock.rotation}deg) scale(${rock.scale})`,
      }"
    ></div>

    <div
      v-for="(ripple, index) in ripples"
      :key="`ripple-${index}`"
      class="ripple"
      :style="{
        left: `${ripple.x}%`,
        top: `${ripple.y}%`,
        width: `${ripple.size}px`,
        height: `${ripple.size}px`,
        opacity: ripple.opacity,
      }"
    ></div>

    <!-- Sand patterns that change with visibility -->
    <div class="sand-patterns" :style="{ opacity: visibilityOpacity }">
      <div class="pattern pattern-1"></div>
      <div class="pattern pattern-2"></div>
      <div class="pattern pattern-3"></div>
    </div>

    <!-- Status indicators -->
    <div class="status-bar">
      <div class="status" :class="{ active: isOnline }">
        {{ isOnline ? "Online" : "Offline" }}
      </div>
      <div class="status" :class="{ active: isVisible }">
        {{ isVisible ? "Visible" : "Hidden" }}
      </div>
      <div class="status" :class="{ active: isShaking }">
        {{ isShaking ? "Shaking!" : "Still" }}
      </div>
    </div>

    <!-- Instructions -->
    <div class="instructions">
      <p v-if="isMobile">Shake your device to rearrange the garden</p>
      <p v-else>Click to add ripples • Switch tabs to change patterns</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Reactive state
const rocks = ref<
  Array<{ x: number; y: number; rotation: number; scale: number }>
>([]);
const ripples = ref<
  Array<{ x: number; y: number; size: number; opacity: number }>
>([]);
const isShaking = ref(false);
const isOnline = ref(true);
const isVisible = ref(true);
const visibilityOpacity = ref(1);
const isMobile = ref(false);

// Initialize the garden
const initializeGarden = () => {
  // Create random rocks
  rocks.value = Array.from({ length: 8 }, () => ({
    x: Math.random() * 80 + 10, // 10-90%
    y: Math.random() * 60 + 20, // 20-80%
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }));
};

// Add ripple effect
const addRipple = (x: number, y: number) => {
  const newRipple = {
    x,
    y,
    size: 10,
    opacity: 1,
  };

  ripples.value.push(newRipple);

  // Animate ripple
  const rippleIndex = ripples.value.length - 1;
  let size = 10;
  const growInterval = setInterval(() => {
    size += 5;
    ripples.value[rippleIndex].size = size;
    ripples.value[rippleIndex].opacity -= 0.05;

    if (ripples.value[rippleIndex].opacity <= 0) {
      clearInterval(growInterval);
      ripples.value.splice(rippleIndex, 1);
    }
  }, 50);
};

// Shake to rearrange
const handleShake = () => {
  isShaking.value = true;
  initializeGarden();

  setTimeout(() => {
    isShaking.value = false;
  }, 1000);
};

// Device shake detection
let lastAcceleration = { x: 0, y: 0, z: 0 };
const shakeThreshold = 15;

const handleDeviceMotion = (event: DeviceMotionEvent) => {
  if (!event.accelerationIncludingGravity) return;

  const { x, y, z } = event.accelerationIncludingGravity;
  if (x === null || y === null || z === null) return;

  const deltaX = Math.abs(x - lastAcceleration.x);
  const deltaY = Math.abs(y - lastAcceleration.y);
  const deltaZ = Math.abs(z - lastAcceleration.z);

  if (deltaX + deltaY + deltaZ > shakeThreshold) {
    handleShake();
  }

  lastAcceleration = { x, y, z };
};

// Click/tap handler
const handleClick = (event: MouseEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  addRipple(x, y);
};

// Visibility change handler
const handleVisibilityChange = () => {
  isVisible.value = !document.hidden;

  if (document.hidden) {
    // When tab is hidden, fade patterns
    visibilityOpacity.value = 0.3;
  } else {
    // When tab becomes visible, brighten patterns
    visibilityOpacity.value = 1;
  }
};

// Online/offline handler
const handleOnline = () => {
  isOnline.value = true;
  // Add a celebratory ripple in the center
  addRipple(50, 50);
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

// Lifecycle
onMounted(() => {
  initializeGarden();
  checkMobile();

  // Event listeners
  window.addEventListener("devicemotion", handleDeviceMotion);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // For desktop shake simulation (using keyboard)
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      handleShake();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("devicemotion", handleDeviceMotion);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
});
</script>

<style scoped>
.zen-garden {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.zen-garden.mobile-shake {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to bottom, #87ceeb, #e0f7ff);
}

.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to bottom, #f0e6d2, #e8dcc5);
}

.rock {
  position: absolute;
  width: 40px;
  height: 30px;
  background: #7a7a7a;
  border-radius: 50%;
  transition: all 0.8s ease;
}

.rock::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 5px;
  width: 30px;
  height: 20px;
  background: #6a6a6a;
  border-radius: 50%;
}

.ripple {
  position: absolute;
  border: 2px solid rgba(100, 150, 255, 0.7);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: all 0.2s ease;
}

.sand-patterns {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  transition: opacity 1s ease;
}

.pattern {
  position: absolute;
  background: rgba(200, 180, 150, 0.2);
}

.pattern-1 {
  top: 20%;
  left: 10%;
  width: 80%;
  height: 2px;
}

.pattern-2 {
  top: 40%;
  left: 15%;
  width: 70%;
  height: 1px;
}

.pattern-3 {
  top: 60%;
  left: 5%;
  width: 90%;
  height: 3px;
  transform: rotate(5deg);
}

.status-bar {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status {
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.status.active {
  background: rgba(76, 175, 80, 0.8);
}

.instructions {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  font-size: 14px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .zen-garden {
    height: 300px;
  }

  .instructions p {
    font-size: 12px;
  }
}
</style>
