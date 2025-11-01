<template>
  <div class="cosmic-vortex" ref="container">
    <!-- Main Vortex Canvas -->
    <canvas
      ref="vortexCanvas"
      class="vortex-canvas"
      @mousemove="handleMouseMove"
      @click="createNova"
    />

    <!-- Floating Particles -->
    <div class="particle-layer">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="particleStyle(particle)"
      >
        <div class="particle-glow"></div>
      </div>
    </div>

    <!-- Nebula Overlays -->
    <div class="nebula nebula-1" :style="nebulaStyle(0)"></div>
    <div class="nebula nebula-2" :style="nebulaStyle(1)"></div>

    <!-- Interactive Controls -->
    <div class="cosmic-controls">
      <button @click="toggleVortexType" class="control-btn">
        {{ vortexType === "blackhole" ? "🕳️" : "🌪️" }}
        {{ vortexType === "blackhole" ? "Black Hole" : "Galaxy" }}
      </button>
      <button @click="toggleAudio" class="control-btn">
        {{ audioEnabled ? "🔊" : "🔇" }} Space Audio
      </button>
      <button @click="createSupernova" class="control-btn">💥 Supernova</button>
      <button @click="toggleAutoRotation" class="control-btn">
        {{ autoRotate ? "⏸️" : "▶️" }} Rotation
      </button>
    </div>

    <!-- Stats Display -->
    <div class="cosmic-stats">
      <div>Particles: {{ particles.length }}</div>
      <div>FPS: {{ fps }}</div>
      <div>Energy: {{ Math.round(energy * 100) }}%</div>
    </div>

    <!-- Audio Elements -->
    <audio ref="spaceAmbience" loop>
      <!-- <source src="/space-ambience.mp3" type="audio/mpeg" /> -->
    </audio>
    <audio ref="novaSound">
      <!-- <source src="/nova-explosion.mp3" type="audio/mpeg" /> -->
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

// Refs
const container = ref(null);
const vortexCanvas = ref(null);
const spaceAmbience = ref(null);
const novaSound = ref(null);

// Core state
const vortexType = ref("blackhole"); // 'blackhole' or 'galaxy'
const autoRotate = ref(true);
const audioEnabled = ref(false);
const mousePos = ref({ x: 0, y: 0 });
const energy = ref(0.5);
const fps = ref(0);

// Visual parameters
const vortexParams = ref({
  rotationSpeed: 0.002,
  spiralTightness: 0.1,
  particleCount: 2000,
  glowIntensity: 0.8,
  distortion: 1.0,
});

// Particles system
const particles = ref([]);
const nebulaLayers = ref([
  { hue: 280, saturation: 80, opacity: 0.3, scale: 1.2, speed: 0.0001 },
  { hue: 220, saturation: 60, opacity: 0.2, scale: 1.5, speed: -0.00005 },
]);

// Animation control
let animationFrame;
let lastFrameTime = 0;
let frameCount = 0;
let lastFpsUpdate = 0;

// Shader-like functions
const turbulence = (x, y, time) => {
  return (
    Math.sin(x * 10 + time) *
    Math.cos(y * 6 + time * 1.3) *
    Math.sin(time * 0.7 + x * 8)
  );
};

const fractalNoise = (x, y, time) => {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  for (let i = 0; i < 4; i++) {
    value +=
      turbulence(x * frequency, y * frequency, time * frequency) * amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
};

// Initialize vortex
const initVortex = () => {
  const canvas = vortexCanvas.value;
  if (!canvas) return;

  resizeCanvas();
  createParticles();
  animate();
};

// Create particle system
const createParticles = () => {
  particles.value = [];
  const count = vortexParams.value.particleCount;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.pow(Math.random(), 2) * 400;
    const size = Math.random() * 2 + 0.5;

    particles.value.push({
      id: i,
      x: 0,
      y: 0,
      z: Math.random() * 200 - 100,
      originalAngle: angle,
      originalDistance: distance,
      size: size,
      speed: 0.002 + Math.random() * 0.003,
      brightness: 0.3 + Math.random() * 0.7,
      hue:
        vortexType.value === "blackhole"
          ? 240 + Math.random() * 60
          : 280 + Math.random() * 80,
    });
  }
};

// Particle styling
const particleStyle = (particle) => {
  const scale = 1 + (particle.z + 100) / 400;
  const opacity = Math.max(
    0.1,
    particle.brightness * (1 - Math.abs(particle.z) / 150)
  );

  return {
    transform: `translate(${particle.x}px, ${particle.y}px) scale(${scale})`,
    opacity: opacity,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    filter: `hue-rotate(${particle.hue}deg) blur(${1 - opacity}px)`,
  };
};

// Nebula styling
const nebulaStyle = (index) => {
  const layer = nebulaLayers.value[index];
  const time = Date.now() * 0.001;
  const driftX = Math.sin(time * layer.speed * 1000) * 20;
  const driftY = Math.cos(time * layer.speed * 1500) * 15;

  return {
    background: `radial-gradient(circle at 30% 30%, 
      hsla(${layer.hue}, ${layer.saturation}%, 60%, ${layer.opacity}),
      hsla(${layer.hue + 40}, ${layer.saturation}%, 40%, ${
      layer.opacity * 0.3
    }),
      transparent 70%)`,
    transform: `scale(${layer.scale}) translate(${driftX}px, ${driftY}px)`,
    opacity: layer.opacity,
  };
};

// Main animation loop
const animate = (currentTime = 0) => {
  if (!vortexCanvas.value) return;

  // FPS calculation
  frameCount++;
  if (currentTime - lastFpsUpdate >= 1000) {
    fps.value = Math.round((frameCount * 1000) / (currentTime - lastFpsUpdate));
    frameCount = 0;
    lastFpsUpdate = currentTime;
  }

  const canvas = vortexCanvas.value;
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const time = currentTime * 0.001;

  // Clear canvas with fade effect for motion blur
  ctx.fillStyle = `rgba(5, 5, 15, 0.1)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw vortex core
  drawVortexCore(ctx, centerX, centerY, time);

  // Update and draw particles
  updateParticles(time, centerX, centerY);
  drawParticles(ctx, time);

  // Draw accretion disk for blackhole
  if (vortexType.value === "blackhole") {
    drawAccretionDisk(ctx, centerX, centerY, time);
  }

  // Draw lens flare effects
  drawLensFlares(ctx, centerX, centerY, time);

  animationFrame = requestAnimationFrame(animate);
};

// Draw vortex core with realistic physics
const drawVortexCore = (ctx, centerX, centerY, time) => {
  const coreRadius = vortexType.value === "blackhole" ? 30 : 50;
  const glowRadius = coreRadius * (3 + Math.sin(time * 2) * 0.5);

  // Core glow
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    coreRadius * 0.5,
    centerX,
    centerY,
    glowRadius
  );

  if (vortexType.value === "blackhole") {
    gradient.addColorStop(0, "rgba(20, 20, 40, 0.9)");
    gradient.addColorStop(0.3, "rgba(80, 60, 180, 0.6)");
    gradient.addColorStop(1, "rgba(40, 20, 100, 0)");
  } else {
    gradient.addColorStop(0, "rgba(100, 80, 220, 0.8)");
    gradient.addColorStop(0.5, "rgba(80, 120, 255, 0.4)");
    gradient.addColorStop(1, "rgba(60, 80, 180, 0)");
  }

  ctx.beginPath();
  ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Event horizon for blackhole
  if (vortexType.value === "blackhole") {
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();

    // Gravitational lensing effect
    const lensGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      coreRadius - 5,
      centerX,
      centerY,
      coreRadius + 15
    );
    lensGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
    lensGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius + 10, 0, Math.PI * 2);
    ctx.strokeStyle = lensGradient;
    ctx.lineWidth = 10;
    ctx.stroke();
  }
};

// Update particle positions with vortex physics
const updateParticles = (time, centerX, centerY) => {
  const rotation = autoRotate.value
    ? time * vortexParams.value.rotationSpeed
    : 0;
  const mouseInfluence = 0.0002;

  particles.value.forEach((particle) => {
    // Base vortex motion
    let angle = particle.originalAngle + rotation * particle.speed * 100;
    let distance = particle.originalDistance;

    // Mouse interaction
    const dx = mousePos.value.x - centerX;
    const dy = mousePos.value.y - centerY;
    const mouseDist = Math.sqrt(dx * dx + dy * dy);

    if (mouseDist < 300) {
      const influence = (300 - mouseDist) / 300;
      angle += Math.atan2(dy, dx) * influence * mouseInfluence;
      distance *= 1 - influence * 0.1;
    }

    // Spiral motion
    if (vortexType.value === "galaxy") {
      distance = particle.originalDistance * (0.8 + Math.sin(angle * 2) * 0.2);
    }

    // Z-axis movement for 3D effect
    particle.z += Math.sin(angle + time) * 0.5;
    particle.z = Math.max(-100, Math.min(100, particle.z));

    // Apply turbulence
    const turb = fractalNoise(particle.x * 0.01, particle.y * 0.01, time) * 20;
    distance += turb;

    // Calculate final position
    particle.x = centerX + Math.cos(angle) * distance;
    particle.y = centerY + Math.sin(angle) * distance;

    // Dynamic brightness
    particle.brightness = 0.3 + Math.abs(Math.sin(angle * 3 + time)) * 0.5;
  });
};

// Draw particles with WebGL-like effects
const drawParticles = (ctx, time) => {
  particles.value.forEach((particle) => {
    const alpha = particle.brightness * (1 - Math.abs(particle.z) / 150);
    const size = particle.size * (1 + particle.z / 200);

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);

    if (vortexType.value === "blackhole") {
      ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${alpha})`;
    } else {
      ctx.fillStyle = `hsla(${particle.hue}, 90%, 80%, ${alpha})`;
    }

    ctx.fill();

    // Glow effect for bright particles
    if (alpha > 0.6) {
      const glowGradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        size * 3
      );
      glowGradient.addColorStop(
        0,
        `hsla(${particle.hue}, 100%, 80%, ${alpha * 0.5})`
      );
      glowGradient.addColorStop(1, `hsla(${particle.hue}, 100%, 80%, 0)`);

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    }
  });
};

// Draw accretion disk for blackhole
const drawAccretionDisk = (ctx, centerX, centerY, time) => {
  const innerRadius = 35;
  const outerRadius = 250;

  for (let r = innerRadius; r < outerRadius; r += 2) {
    const progress = (r - innerRadius) / (outerRadius - innerRadius);
    const alpha = 0.3 * (1 - progress);
    const hue = 280 + progress * 60;

    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

// Draw realistic lens flares
const drawLensFlares = (ctx, centerX, centerY, time) => {
  const flares = [
    { angle: time * 0.5, distance: 150, size: 20, alpha: 0.3 },
    { angle: time * 0.8, distance: 200, size: 15, alpha: 0.2 },
    { angle: time * 1.2, distance: 250, size: 25, alpha: 0.15 },
  ];

  flares.forEach((flare) => {
    const x = centerX + Math.cos(flare.angle) * flare.distance;
    const y = centerY + Math.sin(flare.angle) * flare.distance;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, flare.size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${flare.alpha})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.arc(x, y, flare.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  });
};

// Interactive functions
const handleMouseMove = (event) => {
  const canvas = vortexCanvas.value;
  const rect = canvas.getBoundingClientRect();
  mousePos.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };

  // Increase energy near center
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const dx = mousePos.value.x - centerX;
  const dy = mousePos.value.y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  energy.value = Math.max(0.3, 1 - distance / 400);
};

const createNova = () => {
  if (novaSound.value) {
    novaSound.value.currentTime = 0;
    novaSound.value.play();
  }

  // Add energy burst
  energy.value = Math.min(1, energy.value + 0.3);

  // Create explosion particles
  const explosionParticles = 50;
  for (let i = 0; i < explosionParticles; i++) {
    setTimeout(() => {
      particles.value.push({
        id: Date.now() + i,
        x: mousePos.value.x,
        y: mousePos.value.y,
        z: 0,
        originalAngle: Math.random() * Math.PI * 2,
        originalDistance: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: 0.01 + Math.random() * 0.02,
        brightness: 1,
        hue: 60 + Math.random() * 60,
      });
    }, i * 20);
  }
};

const createSupernova = () => {
  energy.value = 1;
  vortexParams.value.glowIntensity = 2;
  vortexParams.value.rotationSpeed *= 3;

  setTimeout(() => {
    vortexParams.value.glowIntensity = 0.8;
    vortexParams.value.rotationSpeed /= 3;
  }, 2000);
};

const toggleVortexType = () => {
  vortexType.value = vortexType.value === "blackhole" ? "galaxy" : "blackhole";
  createParticles();
};

const toggleAudio = () => {
  if (!spaceAmbience.value) return;
  audioEnabled.value = !audioEnabled.value;
  audioEnabled.value ? spaceAmbience.value.play() : spaceAmbience.value.pause();
};

const toggleAutoRotation = () => {
  autoRotate.value = !autoRotate.value;
};

// Utility functions
const resizeCanvas = () => {
  const canvas = vortexCanvas.value;
  if (!canvas) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

// Lifecycle
onMounted(() => {
  initVortex();
  window.addEventListener("resize", resizeCanvas);
});

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  window.removeEventListener("resize", resizeCanvas);
});
</script>

<style scoped>
.cosmic-vortex {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #0a0a1a 0%, #000000 100%);
  overflow: hidden;
  cursor: crosshair;
}

.vortex-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.particle-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, #ffffff, transparent 70%);
  pointer-events: none;
  transition: transform 0.1s ease-out;
}

.particle-glow {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: inherit;
  filter: blur(3px);
}

.nebula {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;
  transition: all 2s ease-in-out;
}

.nebula-1 {
  animation: nebulaFloat 40s infinite linear;
}

.nebula-2 {
  animation: nebulaFloat 60s infinite linear reverse;
}

.cosmic-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-family: "Arial", sans-serif;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.cosmic-stats {
  position: absolute;
  top: 20px;
  right: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Courier New", monospace;
  font-size: 12px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
}

@keyframes nebulaFloat {
  0% {
    transform: scale(1.2) translate(0px, 0px) rotate(0deg);
  }
  25% {
    transform: scale(1.3) translate(10px, 15px) rotate(90deg);
  }
  50% {
    transform: scale(1.2) translate(20px, 10px) rotate(180deg);
  }
  75% {
    transform: scale(1.25) translate(15px, 5px) rotate(270deg);
  }
  100% {
    transform: scale(1.2) translate(0px, 0px) rotate(360deg);
  }
}

/* Performance optimizations */
.vortex-canvas {
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
  image-rendering: optimize-contrast;
}

/* Responsive design */
@media (max-width: 768px) {
  .cosmic-controls {
    flex-direction: column;
    align-items: center;
  }

  .control-btn {
    padding: 8px 12px;
    font-size: 11px;
  }
}
</style>
