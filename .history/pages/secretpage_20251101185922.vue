<template>
  <div class="midnight-garden" ref="container">
    <!-- Starry Background -->
    <canvas ref="starsCanvas" class="stars-canvas"></canvas>

    <!-- Interactive Elements -->
    <div class="moon" @click="moonClick" :style="moonStyle">
      <div
        class="moon-crater"
        v-for="crater in craters"
        :key="crater.id"
        :style="crater.style"
      ></div>
    </div>

    <!-- Fireflies -->
    <div
      class="firefly"
      v-for="firefly in fireflies"
      :key="firefly.id"
      :style="fireflyStyle(firefly)"
    >
      ✨
    </div>

    <!-- Magic Flowers -->
    <div
      class="flower"
      v-for="flower in flowers"
      :key="flower.id"
      :style="flowerStyle(flower)"
      @click="bloomFlower(flower)"
    >
      <div
        class="flower-petal"
        v-for="petal in flower.petals"
        :key="petal.id"
        :style="petalStyle(petal, flower)"
      ></div>
      <div class="flower-center" :style="flowerCenterStyle(flower)"></div>
    </div>

    <!-- Shooting Stars -->
    <div
      class="shooting-star"
      v-for="star in shootingStars"
      :key="star.id"
      :style="shootingStarStyle(star)"
    >
      🌟
    </div>

    <!-- Interactive Controls -->
    <div class="controls">
      <button @click="makeWish" class="wish-btn">🌠 Make a Wish</button>
      <button @click="summonFireflies" class="firefly-btn">
        ✨ Summon Fireflies
      </button>
      <button @click="toggleMusic" class="music-btn">
        {{ musicPlaying ? "🔇" : "🎵" }} Night Sounds
      </button>
    </div>

    <!-- Hidden Messages -->
    <div v-if="showSecretMessage" class="secret-message">
      {{ secretMessage }}
    </div>

    <!-- Audio -->
    <audio ref="nightSounds" loop>
      <source src="/savior.mp3" type="audio/mpeg" />
    </audio>
    <audio ref="wishSound">
      <source src="/savior.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

// Refs
const container = ref(null);
const starsCanvas = ref(null);
const nightSounds = ref(null);
const wishSound = ref(null);

// State
const musicPlaying = ref(false);
const showSecretMessage = ref(false);
const secretMessage = ref("");
const mousePos = ref({ x: 0, y: 0 });

// Moon interaction
const moonPhase = ref(0);
const moonPulse = ref(0);

const moonStyle = computed(() => ({
  transform: `scale(${1 + Math.sin(moonPulse.value) * 0.1})`,
  boxShadow: `0 0 ${30 + moonPulse.value * 20}px ${
    10 + moonPulse.value * 5
  }px rgba(255, 255, 200, 0.3)`,
}));

const craters = ref([
  { id: 1, style: { top: "20%", left: "30%", width: "15px", height: "15px" } },
  { id: 2, style: { top: "60%", left: "50%", width: "10px", height: "10px" } },
  { id: 3, style: { top: "40%", left: "70%", width: "12px", height: "12px" } },
]);

// Fireflies
const fireflies = ref([]);

// Flowers
const flowers = ref([]);

// Shooting stars
const shootingStars = ref([]);

// Animation frames
let starsAnimationFrame;
let moonAnimationFrame;
let firefliesAnimationFrame;

// Initialize the scene
const initScene = () => {
  createStars();
  createFireflies(15);
  createFlowers(8);
  startAnimations();
};

// Starfield
const createStars = () => {
  const canvas = starsCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Create stars
  const stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      brightness: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.05 + 0.02,
    });
  }

  const animateStars = () => {
    ctx.fillStyle = "#0a0a2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      star.brightness =
        0.2 + Math.abs(Math.sin(Date.now() * star.speed * 0.001)) * 0.6;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fill();
    });

    starsAnimationFrame = requestAnimationFrame(animateStars);
  };

  animateStars();
};

// Fireflies
const createFireflies = (count) => {
  fireflies.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.5 + 0.5,
    speed: Math.random() * 0.5 + 0.2,
    brightness: Math.random() * 0.8 + 0.2,
    angle: Math.random() * Math.PI * 2,
  }));
};

const fireflyStyle = (firefly) => ({
  left: `${firefly.x}%`,
  top: `${firefly.y}%`,
  fontSize: `${firefly.size}em`,
  opacity: firefly.brightness,
  filter: `blur(${1 - firefly.brightness}px)`,
});

const animateFireflies = () => {
  fireflies.value.forEach((firefly) => {
    firefly.angle += (Math.random() - 0.5) * 0.5;
    firefly.x += Math.cos(firefly.angle) * firefly.speed;
    firefly.y += Math.sin(firefly.angle) * firefly.speed;

    // Boundary check
    if (firefly.x < 0) firefly.x = 100;
    if (firefly.x > 100) firefly.x = 0;
    if (firefly.y < 0) firefly.y = 100;
    if (firefly.y > 100) firefly.y = 0;

    // Pulsing brightness
    firefly.brightness =
      0.3 + Math.abs(Math.sin(Date.now() * 0.002 + firefly.id)) * 0.5;
  });

  firefliesAnimationFrame = requestAnimationFrame(animateFireflies);
};

// Magic Flowers
const createFlowers = (count) => {
  flowers.value = Array.from({ length: count }, (_, i) => {
    const petalCount = 6 + Math.floor(Math.random() * 4);
    return {
      id: i,
      x: 10 + Math.random() * 80,
      y: 40 + Math.random() * 50,
      size: Math.random() * 0.8 + 0.7,
      bloomed: false,
      glow: 0,
      color: `hsl(${Math.random() * 60 + 280}, 70%, 60%)`,
      petals: Array.from({ length: petalCount }, (_, p) => ({
        id: p,
        rotation: (p * 360) / petalCount,
      })),
    };
  });
};

const flowerStyle = (flower) => ({
  left: `${flower.x}%`,
  top: `${flower.y}%`,
  transform: `scale(${flower.size})`,
  filter: `blur(${flower.glow * 2}px)`,
});

const petalStyle = (petal, flower) => ({
  transform: `rotate(${petal.rotation}deg) scale(${flower.bloomed ? 1 : 0})`,
  backgroundColor: flower.color,
});

const flowerCenterStyle = (flower) => ({
  backgroundColor: `hsl(60, 80%, ${flower.bloomed ? 70 : 30}%)`,
  boxShadow: flower.bloomed
    ? `0 0 ${flower.glow * 20}px ${flower.glow * 10}px gold`
    : "none",
});

const bloomFlower = (flower) => {
  flower.bloomed = true;
  flower.glow = 1;

  setTimeout(() => {
    flower.glow = 0.3;
  }, 1000);
};

// Shooting Stars
const createShootingStar = () => {
  const star = {
    id: Date.now(),
    x: -10,
    y: Math.random() * 50,
    length: Math.random() * 50 + 30,
    speed: Math.random() * 10 + 5,
    angle: Math.random() * 30 + 15,
  };

  shootingStars.value.push(star);

  setTimeout(() => {
    shootingStars.value = shootingStars.value.filter((s) => s.id !== star.id);
  }, 2000);
};

const shootingStarStyle = (star) => ({
  left: `${star.x}%`,
  top: `${star.y}%`,
  transform: `rotate(${star.angle}deg)`,
  width: `${star.length}px`,
});

// Interactions
const moonClick = () => {
  moonPulse.value = 1;
  showSecretMessage.value = true;
  secretMessage.value = "The moon whispers: Your dreams are valid 🌙";

  setTimeout(() => {
    moonPulse.value = 0;
    setTimeout(() => {
      showSecretMessage.value = false;
    }, 3000);
  }, 500);

  createShootingStar();
};

const makeWish = () => {
  if (wishSound.value) {
    wishSound.value.currentTime = 0;
    wishSound.value.play();
  }

  // Create multiple shooting stars
  for (let i = 0; i < 3; i++) {
    setTimeout(() => createShootingStar(), i * 300);
  }

  // Bloom all flowers
  flowers.value.forEach((flower) => bloomFlower(flower));

  // Enhance fireflies
  fireflies.value.forEach((firefly) => {
    firefly.brightness = 1;
    firefly.size *= 1.5;
  });
};

const summonFireflies = () => {
  createFireflies(10);
};

const toggleMusic = () => {
  if (!nightSounds.value) return;

  if (musicPlaying.value) {
    nightSounds.value.pause();
  } else {
    nightSounds.value.play();
  }
  musicPlaying.value = !musicPlaying.value;
};

// Mouse tracking for interactive elements
const handleMouseMove = (event) => {
  if (!container.value) return;

  const rect = container.value.getBoundingClientRect();
  mousePos.value = {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100,
  };

  // Fireflies follow mouse slightly
  fireflies.value.forEach((firefly) => {
    const dx = mousePos.value.x - firefly.x;
    const dy = mousePos.value.y - firefly.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 20) {
      firefly.angle = Math.atan2(dy, dx);
    }
  });
};

// Animation loops
const startAnimations = () => {
  animateFireflies();

  // Occasional shooting stars
  setInterval(() => {
    if (Math.random() < 0.3) {
      createShootingStar();
    }
  }, 5000);

  // Moon pulse
  const animateMoon = () => {
    moonPulse.value = Math.sin(Date.now() * 0.001) * 0.5;
    moonAnimationFrame = requestAnimationFrame(animateMoon);
  };
  animateMoon();
};

// Lifecycle
onMounted(() => {
  initScene();
  window.addEventListener("mousemove", handleMouseMove);
});

onBeforeUnmount(() => {
  if (starsAnimationFrame) cancelAnimationFrame(starsAnimationFrame);
  if (moonAnimationFrame) cancelAnimationFrame(moonAnimationFrame);
  if (firefliesAnimationFrame) cancelAnimationFrame(firefliesAnimationFrame);
  window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style scoped>
.midnight-garden {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a2a 0%, #1a1a4a 50%, #2d1b69 100%);
  overflow: hidden;
  cursor: none;
}

.stars-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.moon {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f0f0aa 0%, #e0e0c0 100%);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.5s ease;
  z-index: 10;
}

.moon-crater {
  position: absolute;
  background: rgba(200, 200, 150, 0.3);
  border-radius: 50%;
}

.firefly {
  position: absolute;
  pointer-events: none;
  transition: all 2s ease;
  z-index: 5;
  text-shadow: 0 0 10px currentColor;
}

.flower {
  position: absolute;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.8s ease;
  z-index: 2;
}

.flower-petal {
  position: absolute;
  width: 15px;
  height: 8px;
  top: 5px;
  left: 12.5px;
  border-radius: 50%;
  transform-origin: 50% 100%;
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.flower-center {
  position: absolute;
  width: 10px;
  height: 10px;
  top: 15px;
  left: 15px;
  border-radius: 50%;
  transition: all 0.8s ease;
}

.shooting-star {
  position: absolute;
  color: white;
  pointer-events: none;
  transition: all 1s linear;
  z-index: 3;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 20;
}

.controls button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.controls button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.secret-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 30px;
  border-radius: 15px;
  font-size: 18px;
  color: #2d1b69;
  z-index: 100;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
