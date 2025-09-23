<template>
  <section class="contact-section py-5 position-relative">
    <!-- Shooting Stars -->
    <div class="shooting-stars">
      <div
        v-for="n in 5"
        :key="n"
        class="shooting-star"
        :style="`--delay: ${n * 2}s; --duration: ${3 + n}s;`"
      ></div>
    </div>

    <!-- Eclipse Effect -->
    <div class="eclipse-overlay" :class="{ active: isEclipse }"></div>

    <div
      class="moon"
      :class="{ eclipse: isEclipse, 'moon-glow-effect': isAstronautOnMoon }"
      @click="toggleEclipse"
    >
      <div
        class="moon-crater"
        v-for="n in 8"
        :key="n"
        :style="getCraterStyle(n)"
      ></div>
      <div class="moon-glow"></div>

      <!-- Moon particles for Easter egg -->
      <div
        v-for="particle in moonParticles"
        :key="particle.id"
        class="moon-particle"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          width: particle.size + 'px',
          height: particle.size + 'px',
          opacity: particle.opacity,
          backgroundColor: particle.color,
        }"
      ></div>
    </div>

    <!-- Night Sky Background with Stars -->
    <div class="night-bg">
      <div class="stars">
        <div
          v-for="n in 150"
          :key="n"
          class="star"
          :style="getStarStyle(n)"
        ></div>
      </div>
      <div
        class="constellation constellation-orion"
        :style="getConstellationStyle('orion')"
      >
        <div
          class="constellation-star"
          v-for="(star, index) in orionStars"
          :key="index"
          :style="`top: ${star.y}%; left: ${star.x}%;`"
        ></div>
        <div
          class="constellation-line"
          v-for="(line, index) in orionLines"
          :key="'line' + index"
          :style="`top: ${line.startY}%; left: ${line.startX}%; width: ${line.width}%; transform: rotate(${line.angle}deg);`"
        ></div>
      </div>
    </div>

    <div class="container position-relative" style="z-index: 2">
      <div class="row align-items-center">
        <div class="col-lg-6 mb-5 mb-lg-0">
          <h2 class="mb-4 fw-bold text-white">
            Contact Me <span class="text-highlight">Under the Stars ✨</span>
          </h2>

          <form
            action="https://formsubmit.co/18aef7e8cffd038a8d44aa69bd4c869e"
            method="POST"
            class="p-4 rounded shadow-lg bg-dark text-white border border-secondary contact-form"
            @submit="handleSubmit"
          >
            <div class="mb-3">
              <label class="form-label">Your Name</label>
              <input
                type="text"
                name="name"
                class="form-control creative-input"
                placeholder="Enter your name"
                required
                v-model="formData.name"
                @focus="animateInput"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                type="email"
                name="email"
                class="form-control creative-input"
                placeholder="Enter your email"
                required
                v-model="formData.email"
                @focus="animateInput"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Message</label>
              <textarea
                name="message"
                rows="4"
                class="form-control creative-input"
                placeholder="Type your message..."
                required
                v-model="formData.message"
                @focus="animateInput"
              ></textarea>
            </div>

            <!-- Hidden fields -->
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" />

            <!-- Send button -->
            <button
              type="submit"
              class="btn send-btn w-100"
              :class="{ sending: isSending }"
            >
              <span v-if="!isSending">🌌 Send Message</span>
              <span v-else class="sending-text">
                <span class="spinner"></span>
                Sending...
              </span>
            </button>

            <!-- Success Message -->
            <div v-if="showSuccess" class="success-message mt-3">
              <div class="success-icon">✓</div>
              <p>Message sent successfully! I'll get back to you soon.</p>
            </div>
          </form>
        </div>

        <!-- Creative Side -->
        <div class="col-lg-6 text-center text-light">
          <div class="night-illustration" ref="container">
            <div
              class="floating-astronaut"
              :style="{
                left: astronautPosition.x + 'px',
                top: astronautPosition.y + 'px',
                transform: `rotate(${astronautRotation}deg) scale(${astronautScale})`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="stopDrag"
              @mouseleave="stopDrag"
              @touchstart="startDragTouch"
              @touchmove="onDragTouch"
              @touchend="stopDrag"
              :class="{
                dragging: isDragging,
                'on-moon': isAstronautOnMoon,
                'physics-active': isPhysicsActive,
              }"
              ref="astronaut"
            >
              <div class="astronaut-helmet"></div>
              <div class="astronaut-body"></div>
              <div
                class="astronaut-arm left"
                :style="{ transform: `rotate(${leftArmRotation}deg)` }"
              ></div>
              <div
                class="astronaut-arm right"
                :style="{ transform: `rotate(${rightArmRotation}deg)` }"
              ></div>
              <div class="astronaut-tank"></div>

              <!-- Thruster particles -->
              <div
                v-for="particle in thrusterParticles"
                :key="particle.id"
                class="thruster-particle"
                :style="{
                  left: particle.x + 'px',
                  top: particle.y + 'px',
                  width: particle.size + 'px',
                  height: particle.size + 'px',
                  opacity: particle.opacity,
                }"
              ></div>
            </div>
            <div
              class="satellite"
              :style="`animation-delay: ${Math.random() * 10}s`"
            >
              <div class="satellite-body"></div>
              <div class="satellite-panel"></div>
            </div>
          </div>
          <p class="mt-3 fst-italic">
            Let your words travel across the night sky to reach me.
          </p>

          <!-- Easter egg message -->
          <div v-if="showEasterEgg" class="easter-egg-message mt-3">
            <div class="secret-message">
              <p>🚀 One small step for man, one giant leap for your message!</p>
              <small class="hint-text"
                >The astronaut has landed on the moon!</small
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRafFn } from "@vueuse/core";
import confetti from "canvas-confetti";

const isEclipse = ref(false);
const isSending = ref(false);
const showSuccess = ref(false);
const formData = ref({
  name: "",
  email: "",
  message: "",
});

// Physics and drag refs
const container = ref(null);
const astronaut = ref(null);
const astronautPosition = ref({ x: 150, y: 100 });
const astronautVelocity = ref({ x: 0, y: 0 });
const astronautRotation = ref(0);
const astronautScale = ref(1);
const leftArmRotation = ref(-30);
const rightArmRotation = ref(30);
const isDragging = ref(false);
const isPhysicsActive = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const lastPosition = ref({ x: 0, y: 0 });
const lastTime = ref(0);

// Easter egg refs
const isAstronautOnMoon = ref(false);
const showEasterEgg = ref(false);
const moonParticles = ref([]);
const thrusterParticles = ref([]);
const particleId = ref(0);

// Constellation data
const orionStars = [
  { x: 10, y: 20 },
  { x: 25, y: 15 },
  { x: 40, y: 20 },
  { x: 55, y: 25 },
  { x: 70, y: 20 },
  { x: 85, y: 30 },
];

const orionLines = [
  { startX: 10, startY: 20, width: 15, angle: -10 },
  { startX: 25, startY: 15, width: 15, angle: 10 },
  { startX: 40, startY: 20, width: 15, angle: 5 },
  { startX: 55, startY: 25, width: 15, angle: -5 },
  { startX: 25, startY: 15, width: 30, angle: 15 },
];

// Physics constants
const GRAVITY = 0.2;
const FRICTION = 0.98;
const BOUNCE = 0.7;
const MOON_GRAVITY = 0.05;
const MOON_RADIUS = 75; // Moon radius in pixels
const MOON_CENTER = { x: window.innerWidth - 115, y: 95 }; // Moon position

// Toggle eclipse effect
const toggleEclipse = () => {
  isEclipse.value = !isEclipse.value;
};

// Handle form submission
const handleSubmit = (e) => {
  e.preventDefault();
  isSending.value = true;

  // Simulate API call
  setTimeout(() => {
    isSending.value = false;
    showSuccess.value = true;
    formData.value = { name: "", email: "", message: "" };

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);
  }, 2000);
};

// Animate input on focus
const animateInput = (e) => {
  const input = e.target;
  input.parentElement.classList.add("focused");
  setTimeout(() => {
    input.parentElement.classList.remove("focused");
  }, 1000);
};

// Generate crater positions on moon
const getCraterStyle = (n) => {
  const size = Math.random() * 20 + 5;
  const x = Math.random() * 70 + 15;
  const y = Math.random() * 70 + 15;
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${y}%`,
    left: `${x}%`,
  };
};

// Get constellation style
const getConstellationStyle = (name) => {
  const opacity = Math.random() * 0.3 + 0.1;
  return {
    opacity: opacity,
  };
};

// Get star style
const getStarStyle = (n) => {
  const size = Math.random() * 3 + 1;
  const opacity = Math.random() * 0.7 + 0.3;
  const twinkleDelay = Math.random() * 5;
  return {
    top: `${Math.random() * 120 - 10}%`,
    left: `${Math.random() * 120 - 10}%`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: opacity,
    animationDelay: `${twinkleDelay}s`,
  };
};

// Drag functions
const startDrag = (e) => {
  isDragging.value = true;
  isPhysicsActive.value = false;
  const rect = astronaut.value.getBoundingClientRect();
  const containerRect = container.value.getBoundingClientRect();

  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  lastPosition.value = {
    x: e.clientX - containerRect.left,
    y: e.clientY - containerRect.top,
  };

  lastTime.value = Date.now();
  astronautScale.value = 1.1;
};

const startDragTouch = (e) => {
  if (e.touches.length > 0) {
    isDragging.value = true;
    isPhysicsActive.value = false;
    const rect = astronaut.value.getBoundingClientRect();
    const containerRect = container.value.getBoundingClientRect();

    dragOffset.value = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };

    lastPosition.value = {
      x: e.touches[0].clientX - containerRect.left,
      y: e.touches[0].clientY - containerRect.top,
    };

    lastTime.value = Date.now();
    astronautScale.value = 1.1;
  }
};

const onDrag = (e) => {
  if (!isDragging.value) return;

  const containerRect = container.value.getBoundingClientRect();
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime.value;

  if (deltaTime > 0) {
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    // Calculate velocity based on movement
    astronautVelocity.value = {
      x: ((currentX - lastPosition.value.x) / deltaTime) * 10,
      y: ((currentY - lastPosition.value.y) / deltaTime) * 10,
    };

    lastPosition.value = { x: currentX, y: currentY };
    lastTime.value = currentTime;
  }

  astronautPosition.value = {
    x: e.clientX - containerRect.left - dragOffset.value.x,
    y: e.clientY - containerRect.top - dragOffset.value.y,
  };

  // Add thruster particles while dragging
  addThrusterParticle();
};

const onDragTouch = (e) => {
  if (!isDragging.value || e.touches.length === 0) return;

  const containerRect = container.value.getBoundingClientRect();
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime.value;

  if (deltaTime > 0) {
    const currentX = e.touches[0].clientX - containerRect.left;
    const currentY = e.touches[0].clientY - containerRect.top;

    astronautVelocity.value = {
      x: ((currentX - lastPosition.value.x) / deltaTime) * 10,
      y: ((currentY - lastPosition.value.y) / deltaTime) * 10,
    };

    lastPosition.value = { x: currentX, y: currentY };
    lastTime.value = currentTime;
  }

  astronautPosition.value = {
    x: e.touches[0].clientX - containerRect.left - dragOffset.value.x,
    y: e.touches[0].clientY - containerRect.top - dragOffset.value.y,
  };

  addThrusterParticle();
};

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    isPhysicsActive.value = true;
    astronautScale.value = 1;

    // Check if astronaut is on moon
    checkMoonLanding();
  }
};

// Physics simulation
const updatePhysics = () => {
  if (!isPhysicsActive.value) return;

  // Apply gravity
  astronautVelocity.value.y += GRAVITY;

  // Apply friction
  astronautVelocity.value.x *= FRICTION;
  astronautVelocity.value.y *= FRICTION;

  // Update position
  astronautPosition.value.x += astronautVelocity.value.x;
  astronautPosition.value.y += astronautVelocity.value.y;

  // Update rotation based on velocity
  astronautRotation.value = astronautVelocity.value.x * 0.5;

  // Update arm animations
  leftArmRotation.value = -30 + Math.sin(Date.now() * 0.01) * 20;
  rightArmRotation.value = 30 + Math.cos(Date.now() * 0.01) * 20;

  // Boundary collision
  const containerRect = container.value?.getBoundingClientRect();
  if (containerRect) {
    const astronautRect = astronaut.value?.getBoundingClientRect();
    if (astronautRect) {
      // Left boundary
      if (astronautPosition.value.x < 0) {
        astronautPosition.value.x = 0;
        astronautVelocity.value.x = -astronautVelocity.value.x * BOUNCE;
      }
      // Right boundary
      if (
        astronautPosition.value.x + astronautRect.width >
        containerRect.width
      ) {
        astronautPosition.value.x = containerRect.width - astronautRect.width;
        astronautVelocity.value.x = -astronautVelocity.value.x * BOUNCE;
      }
      // Top boundary
      if (astronautPosition.value.y < 0) {
        astronautPosition.value.y = 0;
        astronautVelocity.value.y = -astronautVelocity.value.y * BOUNCE;
      }
      // Bottom boundary
      if (
        astronautPosition.value.y + astronautRect.height >
        containerRect.height
      ) {
        astronautPosition.value.y = containerRect.height - astronautRect.height;
        astronautVelocity.value.y = -astronautVelocity.value.y * BOUNCE;

        // Add some friction when hitting bottom
        astronautVelocity.value.x *= 0.9;
      }
    }
  }

  // Stop physics when velocity is very small
  if (
    Math.abs(astronautVelocity.value.x) < 0.1 &&
    Math.abs(astronautVelocity.value.y) < 0.1
  ) {
    astronautVelocity.value = { x: 0, y: 0 };
    isPhysicsActive.value = false;
  }

  // Check moon proximity continuously
  checkMoonProximity();
};

// Moon interaction functions
const checkMoonProximity = () => {
  const astronautCenter = {
    x: astronautPosition.value.x + 25, // Approximate center of astronaut
    y: astronautPosition.value.y + 50,
  };

  const distance = Math.sqrt(
    Math.pow(astronautCenter.x - MOON_CENTER.x, 2) +
      Math.pow(astronautCenter.y - MOON_CENTER.y, 2)
  );

  // If astronaut is close to moon, apply moon gravity
  if (distance < MOON_RADIUS + 100 && isPhysicsActive.value) {
    const direction = {
      x: MOON_CENTER.x - astronautCenter.x,
      y: MOON_CENTER.y - astronautCenter.y,
    };

    const length = Math.sqrt(
      direction.x * direction.x + direction.y * direction.y
    );
    if (length > 0) {
      direction.x /= length;
      direction.y /= length;

      astronautVelocity.value.x += direction.x * MOON_GRAVITY;
      astronautVelocity.value.y += direction.y * MOON_GRAVITY;
    }
  }
};

const checkMoonLanding = () => {
  const astronautCenter = {
    x: astronautPosition.value.x + 25,
    y: astronautPosition.value.y + 50,
  };

  const distance = Math.sqrt(
    Math.pow(astronautCenter.x - MOON_CENTER.x, 2) +
      Math.pow(astronautCenter.y - MOON_CENTER.y, 2)
  );

  if (distance < MOON_RADIUS) {
    // Astronaut has landed on the moon!
    isAstronautOnMoon.value = true;
    showEasterEgg.value = true;
    isPhysicsActive.value = false;
    astronautVelocity.value = { x: 0, y: 0 };

    // Trigger moon landing effects
    triggerMoonLandingEffects();

    // Hide easter egg after 5 seconds
    setTimeout(() => {
      showEasterEgg.value = false;
    }, 5000);
  } else {
    isAstronautOnMoon.value = false;
  }
};

const triggerMoonLandingEffects = () => {
  // Confetti effect
  confetti({
    particleCount: 100,
    spread: 70,
    origin: {
      x: MOON_CENTER.x / window.innerWidth,
      y: MOON_CENTER.y / window.innerHeight,
    },
    colors: ["#ffffff", "#ffff00", "#cccccc"],
  });

  // Create moon particles
  for (let i = 0; i < 30; i++) {
    createMoonParticle();
  }
};

// Particle effects
const createMoonParticle = () => {
  const angle = Math.random() * Math.PI * 2;
  const distance = MOON_RADIUS * 0.8;
  const speed = Math.random() * 2 + 1;

  moonParticles.value.push({
    id: particleId.value++,
    x: MOON_CENTER.x + Math.cos(angle) * distance,
    y: MOON_CENTER.y + Math.sin(angle) * distance,
    size: Math.random() * 4 + 2,
    opacity: 1,
    color: ["#ffffff", "#ffff00", "#ffaa00"][Math.floor(Math.random() * 3)],
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 60,
  });
};

const addThrusterParticle = () => {
  thrusterParticles.value.push({
    id: particleId.value++,
    x: Math.random() * 40 - 5,
    y: 70 + Math.random() * 10,
    size: Math.random() * 3 + 1,
    opacity: 1,
    life: 20,
  });
};

const updateParticles = () => {
  // Update moon particles
  moonParticles.value = moonParticles.value
    .map((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.opacity = particle.life / 60;
      particle.life--;
      return particle;
    })
    .filter((particle) => particle.life > 0);

  // Update thruster particles
  thrusterParticles.value = thrusterParticles.value
    .map((particle) => {
      particle.y += 2;
      particle.opacity = particle.life / 20;
      particle.life--;
      return particle;
    })
    .filter((particle) => particle.life > 0);
};

// RAF loop for smooth animations
useRafFn(() => {
  updatePhysics();
  updateParticles();
});

// Initialize positions on mount
onMounted(() => {
  // Set initial astronaut position relative to container
  if (container.value) {
    const containerRect = container.value.getBoundingClientRect();
    astronautPosition.value = {
      x: containerRect.width * 0.3 - 25,
      y: containerRect.height * 0.2 - 50,
    };
  }
});
</script>

<style lang="scss" scoped>
// ... (keep all your existing styles) ...

/* Enhanced astronaut physics styles */
.floating-astronaut {
  position: absolute;
  top: 20%;
  left: 30%;
  animation: float 12s ease-in-out infinite;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
  transition: transform 0.1s ease;
  z-index: 10;

  &.dragging {
    cursor: grabbing;
    animation: none;
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(100, 200, 255, 0.5));
  }

  &.physics-active {
    transition: none;
  }

  &.on-moon {
    filter: drop-shadow(0 0 15px rgba(255, 255, 0, 0.7));
    z-index: 11;
  }
}

/* Moon glow effect when astronaut lands */
.moon-glow-effect {
  box-shadow: 0 0 50px rgba(255, 255, 0, 0.8), 0 0 100px rgba(255, 255, 0, 0.4),
    inset 0 0 50px rgba(255, 255, 200, 0.3) !important;
  animation: moon-pulse 2s ease-in-out infinite;
}

@keyframes moon-pulse {
  0%,
  100% {
    box-shadow: 0 0 50px rgba(255, 255, 0, 0.8),
      0 0 100px rgba(255, 255, 0, 0.4), inset 0 0 50px rgba(255, 255, 200, 0.3);
  }
  50% {
    box-shadow: 0 0 70px rgba(255, 255, 0, 1), 0 0 130px rgba(255, 255, 0, 0.6),
      inset 0 0 70px rgba(255, 255, 200, 0.5);
  }
}

/* Particle effects */
.moon-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 4;
  animation: particle-float 2s ease-out forwards;
}

.thruster-particle {
  position: absolute;
  background: linear-gradient(45deg, #00ffff, #0088ff);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  animation: thruster-fade 1s ease-out forwards;
}

@keyframes particle-float {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes thruster-fade {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0;
  }
}

/* Easter egg message */
.easter-egg-message {
  animation: scaleIn 0.5s ease-out;
}

.secret-message {
  background: rgba(255, 255, 0, 0.1);
  border-left: 3px solid #ffff00;
  padding: 15px;
  margin: 20px 0;
  font-style: italic;
  border-radius: 8px;
}

.hint-text {
  font-size: 0.9em;
  opacity: 0.7;
  margin-top: 10px;
  color: #ffffaa;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Enhanced astronaut animations for physics */
.astronaut-arm {
  transition: transform 0.3s ease;
}

/* Improved boundaries for physics */
.night-illustration {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden; // Changed to hidden to contain physics
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments for physics */
@media (max-width: 768px) {
  .night-illustration {
    height: 300px;
  }

  .floating-astronaut {
    transform: scale(0.8);

    &.dragging {
      transform: scale(0.9);
    }
  }
}

/* Smooth transitions for all interactive elements */
* {
  box-sizing: border-box;
}

/* Prevent text selection during drag */
.floating-astronaut {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Enhanced visual feedback */
.floating-astronaut:active {
  filter: drop-shadow(0 0 10px rgba(100, 200, 255, 0.7));
}

/* Moon crater enhancement for Easter egg */
.moon-crater {
  transition: all 0.5s ease;
}

.moon-glow-effect .moon-crater {
  background: rgba(255, 255, 200, 0.6);
  box-shadow: 0 0 10px rgba(255, 255, 200, 0.4);
}
</style>
