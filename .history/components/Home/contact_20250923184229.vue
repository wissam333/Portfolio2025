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
      :class="{
        eclipse: isEclipse,
        'moon-glow-effect': isAstronautOnMoon,
        'gravity-zone': isPhysicsActive && !isAstronautOnMoon,
      }"
    >
      <div
        class="moon-crater"
        v-for="n in 8"
        :key="n"
        :style="getCraterStyle(n)"
        v-once
      ></div>
      <div class="moon-glow"></div>

      <!-- Moon particles for Easter egg -->
      <div
        v-for="particle in moonParticles"
        :key="particle.id"
        class="moon-particle"
        v-once
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
          v-once
        ></div>
      </div>
      <div
        class="constellation constellation-orion"
        :style="getConstellationStyle('orion')"
        v-once
      >
        <div
          class="constellation-star"
          v-for="(star, index) in orionStars"
          :key="index"
          :style="`top: ${star.y}%; left: ${star.x}%;`"
          v-once
        ></div>
        <div
          class="constellation-line"
          v-for="(line, index) in orionLines"
          v-once
          :key="'line' + index"
          :style="`top: ${line.startY}%; left: ${line.startX}%; width: ${line.width}%; transform: rotate(${line.angle}deg);`"
        ></div>
      </div>
    </div>

    <div class="container" style="z-index: 2">
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
              v-once
              :style="`animation-delay: ${Math.random() * 10}s`"
            >
              <div class="satellite-body"></div>
              <div class="satellite-panel"></div>
            </div>
          </div>

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

const isEclipse = ref(true);
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
const GRAVITY = 0;
const FRICTION = 0.98;
const BOUNCE = 0.7;
const MOON_GRAVITY = 0.05;
const MOON_RADIUS = 75; // Moon radius in pixels
const MOON_CENTER = { x: window.innerWidth - 115, y: 95 }; // Moon position

// Toggle eclipse effect
const toggleEclipse = () => {
  isEclipse.value = false;
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
  e.preventDefault(); // Prevent default behavior
  e.stopPropagation(); // Stop event bubbling

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

  // Add event listeners for the entire document
  document.addEventListener("mousemove", onDragGlobal);
  document.addEventListener("mouseup", stopDragGlobal);
};

const startDragTouch = (e) => {
  e.preventDefault(); // Prevent default touch behavior
  e.stopPropagation();

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

    // Add touch event listeners
    document.addEventListener("touchmove", onDragTouchGlobal, {
      passive: false,
    });
    document.addEventListener("touchend", stopDragGlobal);
  }
};

const onDragGlobal = (e) => {
  e.preventDefault();
  if (!isDragging.value) return;
  onDrag(e);
};

const onDragTouchGlobal = (e) => {
  e.preventDefault();
  if (!isDragging.value || e.touches.length === 0) return;
  onDragTouch(e);
};

const stopDragGlobal = () => {
  stopDrag();
  // Clean up global event listeners
  document.removeEventListener("mousemove", onDragGlobal);
  document.removeEventListener("mouseup", stopDragGlobal);
  document.removeEventListener("touchmove", onDragTouchGlobal);
  document.removeEventListener("touchend", stopDragGlobal);
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

const onDrag = (e) => {
  if (!isDragging.value) return;

  const containerRect = container.value.getBoundingClientRect();
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime.value;

  // Calculate position relative to container
  let clientX = e.clientX;
  let clientY = e.clientY;

  // Boundary checking to prevent going outside viewport
  clientX = Math.max(0, Math.min(clientX, window.innerWidth));
  clientY = Math.max(0, Math.min(clientY, window.innerHeight));

  if (deltaTime > 0) {
    const currentX = clientX - containerRect.left;
    const currentY = clientY - containerRect.top;

    // Calculate velocity with smoothing
    astronautVelocity.value = {
      x: ((currentX - lastPosition.value.x) / deltaTime) * 8, // Reduced multiplier for smoother movement
      y: ((currentY - lastPosition.value.y) / deltaTime) * 8,
    };

    lastPosition.value = { x: currentX, y: currentY };
    lastTime.value = currentTime;
  }

  // Update astronaut position with boundary constraints
  const newX = clientX - containerRect.left - dragOffset.value.x;
  const newY = clientY - containerRect.top - dragOffset.value.y;

  // Keep astronaut within container bounds while dragging
  const astronautRect = astronaut.value.getBoundingClientRect();
  const maxX = containerRect.width - astronautRect.width;
  const maxY = containerRect.height - astronautRect.height;

  astronautPosition.value = {
    x: Math.max(-10, Math.min(newX, maxX + 10)), // Allow slight overflow
    y: Math.max(-10, Math.min(newY, maxY + 10)),
  };

  // Add thruster particles while dragging
  addThrusterParticle();
};

const onDragTouch = (e) => {
  if (!isDragging.value || e.touches.length === 0) return;

  const containerRect = container.value.getBoundingClientRect();
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime.value;

  let clientX = e.touches[0].clientX;
  let clientY = e.touches[0].clientY;

  // Boundary checking
  clientX = Math.max(0, Math.min(clientX, window.innerWidth));
  clientY = Math.max(0, Math.min(clientY, window.innerHeight));

  if (deltaTime > 0) {
    const currentX = clientX - containerRect.left;
    const currentY = clientY - containerRect.top;

    astronautVelocity.value = {
      x: ((currentX - lastPosition.value.x) / deltaTime) * 8,
      y: ((currentY - lastPosition.value.y) / deltaTime) * 8,
    };

    lastPosition.value = { x: currentX, y: currentY };
    lastTime.value = currentTime;
  }

  const newX = clientX - containerRect.left - dragOffset.value.x;
  const newY = clientY - containerRect.top - dragOffset.value.y;

  const astronautRect = astronaut.value.getBoundingClientRect();
  const maxX = containerRect.width - astronautRect.width;
  const maxY = containerRect.height - astronautRect.height;

  astronautPosition.value = {
    x: Math.max(-10, Math.min(newX, maxX + 10)),
    y: Math.max(-10, Math.min(newY, maxY + 10)),
  };

  addThrusterParticle();
};

// Physics simulation
// Update your existing updatePhysics function
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
        astronautVelocity.value.x *= 0.9;
      }
    }
  }

  // Check moon proximity continuously
  checkMoonProximity();

  // NEW: Continuously check for landing during physics simulation
  if (isPhysicsActive.value && !isAstronautOnMoon.value) {
    checkMoonLanding();
  }

  // Stop physics when velocity is very small and not on moon
  if (
    !isAstronautOnMoon.value &&
    Math.abs(astronautVelocity.value.x) < 0.1 &&
    Math.abs(astronautVelocity.value.y) < 0.1
  ) {
    astronautVelocity.value = { x: 0, y: 0 };
    isPhysicsActive.value = false;
  }
};

// Moon interaction functions
const checkMoonProximity = () => {
  if (!isPhysicsActive.value) return;

  const moonElement = document.querySelector(".moon");
  if (!moonElement || !container.value) return;

  const moonRect = moonElement.getBoundingClientRect();
  const containerRect = container.value.getBoundingClientRect();

  const MOON_CENTER = {
    x: moonRect.left - containerRect.left + moonRect.width / 2,
    y: moonRect.top - containerRect.top + moonRect.height / 2,
  };

  const MOON_RADIUS = moonRect.width / 2;
  const GRAVITY_RADIUS = MOON_RADIUS * 2; // Double the radius for gravity effect

  const astronautCenter = {
    x: astronautPosition.value.x + 25,
    y: astronautPosition.value.y + 50,
  };

  const distance = Math.sqrt(
    Math.pow(astronautCenter.x - MOON_CENTER.x, 2) +
      Math.pow(astronautCenter.y - MOON_CENTER.y, 2)
  );

  // If astronaut is close to moon, apply moon gravity
  if (distance < GRAVITY_RADIUS) {
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

      // Stronger gravity when closer to moon
      const gravityStrength = MOON_GRAVITY * (1 - distance / GRAVITY_RADIUS);
      astronautVelocity.value.x += direction.x * gravityStrength;
      astronautVelocity.value.y += direction.y * gravityStrength;
    }
  }
};

const checkMoonLanding = () => {
  // Get the moon element's actual position
  const moonElement = document.querySelector(".moon");
  if (!moonElement || !container.value) return;

  const moonRect = moonElement.getBoundingClientRect();
  const containerRect = container.value.getBoundingClientRect();

  // Calculate moon center relative to the container
  const MOON_CENTER = {
    x: moonRect.left - containerRect.left + moonRect.width / 2,
    y: moonRect.top - containerRect.top + moonRect.height / 2,
  };

  const MOON_RADIUS = moonRect.width / 2;

  // Increase the effective radius for easier landing (50% larger)
  const LANDING_RADIUS = MOON_RADIUS * 1.5;

  const astronautCenter = {
    x: astronautPosition.value.x + 25, // Approximate center of astronaut
    y: astronautPosition.value.y + 50,
  };

  const distance = Math.sqrt(
    Math.pow(astronautCenter.x - MOON_CENTER.x, 2) +
      Math.pow(astronautCenter.y - MOON_CENTER.y, 2)
  );

  console.log("Moon landing check:", {
    astronautCenter,
    MOON_CENTER,
    distance,
    MOON_RADIUS,
    LANDING_RADIUS,
    isLanded: distance < LANDING_RADIUS,
  });

  if (distance < LANDING_RADIUS) {
    // Astronaut has landed on the moon!
    isAstronautOnMoon.value = true;
    showEasterEgg.value = true;
    isPhysicsActive.value = false;
    astronautVelocity.value = { x: 0, y: 0 };

    // Calculate landing position on moon surface
    const angle = Math.atan2(
      astronautCenter.y - MOON_CENTER.y,
      astronautCenter.x - MOON_CENTER.x
    );

    // Position astronaut on moon surface (not necessarily at center)
    const landingX = MOON_CENTER.x + Math.cos(angle) * (MOON_RADIUS - 10);
    const landingY = MOON_CENTER.y + Math.sin(angle) * (MOON_RADIUS - 10);

    astronautPosition.value = {
      x: landingX - 25, // Adjust for astronaut center
      y: landingY - 50,
    };

    // Set rotation to align with moon surface
    astronautRotation.value = (angle * 180) / Math.PI + 90;

    // Trigger moon landing effects
    triggerMoonLandingEffects();
  } else {
    isAstronautOnMoon.value = false;
    if (showEasterEgg.value) {
      showEasterEgg.value = false;
    }
  }
};

const triggerMoonLandingEffects = () => {
  const moonElement = document.querySelector(".moon");
  if (!moonElement) return;
  toggleEclipse();
  const moonRect = moonElement.getBoundingClientRect();
  const moonCenterScreen = {
    x: moonRect.left + moonRect.width / 2,
    y: moonRect.top + moonRect.height / 2,
  };

  // Confetti effect
  confetti({
    particleCount: 100,
    spread: 70,
    origin: {
      x: moonCenterScreen.x / window.innerWidth,
      y: moonCenterScreen.y / window.innerHeight,
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
.contact-section {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* 🌌 Starry Night Background */
.night-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top, #1a1a2e, #0d0d0d);
  overflow: hidden;
  z-index: 1;
}

/* Stars */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: twinkle 5s infinite alternate;
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

/* Shooting Stars */
.shooting-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.shooting-star {
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(300deg, rgba(255, 255, 255, 0.8), transparent);
  animation: shooting-star var(--duration) linear infinite;
  animation-delay: var(--delay);
  top: var(--top, 20%);
  left: var(--left, -100px);
}

@keyframes shooting-star {
  0% {
    transform: translateX(0) translateY(0) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: translateX(100vw) translateY(100vh) rotate(40deg);
    opacity: 0;
  }
}

.text-highlight {
  color: $primary-color;
  text-shadow: 0 0 10px rgba(157, 123, 255, 0.7);
}

/* Inputs */
.creative-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #444;
  color: #fff;
  transition: all 0.3s ease;
}

.creative-input:focus {
  border-color: #9d7bff;
  box-shadow: 0 0 8px rgba(157, 123, 255, 0.7);
  transform: translateY(-2px);
}

.mb-3 {
  position: relative;
  transition: all 0.3s ease;
}

.mb-3.focused::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(157, 123, 255, 0.5);
  animation: pulse 1s ease;
}

@keyframes pulse {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Send button */
.send-btn {
  background: linear-gradient(90deg, #1e1e2f, #3a2e5f);
  border: 1px solid #9d7bff;
  color: #fff;
  font-weight: bold;
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(157, 123, 255, 0.4);
}

.send-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.send-btn:hover::before {
  left: 100%;
}

.send-btn.sending {
  background: linear-gradient(90deg, #2a2a3f, #4a3e6f);
}

.sending-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Success Message */
.success-message {
  display: flex;
  align-items: center;
  background: rgba(46, 125, 50, 0.2);
  border: 1px solid #2e7d32;
  border-radius: 4px;
  padding: 10px;
  animation: fadeIn 0.5s ease;
}

.success-icon {
  background: #2e7d32;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 🌙 Moon */
.moon {
  position: absolute;
  top: 20px;
  right: 40px;
  z-index: 3;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle at 30% 30%, #f5f3ce, #d4d0a5);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(245, 243, 206, 0.7);
  cursor: pointer;
  transition: all 0.5s ease;
  overflow: hidden;
}

.moon:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(245, 243, 206, 0.9);
}

.moon.eclipse {
  background: radial-gradient(circle at 30% 30%, #5a5a5a, #3a3a3a);
  box-shadow: 0 0 30px rgba(90, 90, 90, 0.5);
}

.moon-crater {
  position: absolute;
  background: rgba(139, 137, 112, 0.5);
  border-radius: 50%;
}

.moon-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(245, 243, 206, 0.3),
    transparent 70%
  );
}

/* Eclipse Overlay */
.eclipse-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.eclipse-overlay.active {
  opacity: 1;
}

/* Constellations */
.constellation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.constellation-star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 5px white;
}

.constellation-line {
  position: absolute;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  transform-origin: 0 0;
}

/* Floating Astronaut */
.floating-astronaut {
  position: absolute;
  top: 20%;
  left: 30%;
  animation: float 12s ease-in-out infinite;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
  transition: transform 0.1s ease;
  z-index: 10;
  user-select: none; /* Prevent text selection */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  touch-action: none; /* Disable browser touch actions */

  &.dragging {
    cursor: grabbing !important;
    animation: none;
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(100, 200, 255, 0.5));
    z-index: 1000; /* Ensure it's above everything while dragging */
  }

  /* Regular state */
  &:not(.dragging) {
    cursor: grab;
  }
}

.night-illustration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  inset-inline-start: 0;
  overflow: visible;
  user-select: none;
  -webkit-user-select: none;
}
.night-illustration * {
  user-select: none;
  -webkit-user-select: none;
}

.astronaut-helmet {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 50%;
  position: relative;
  box-shadow: inset -3px -3px 10px rgba(0, 0, 0, 0.2),
    inset 3px 3px 10px rgba(255, 255, 255, 0.8);

  /* Helmet visor reflection */
  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 8px;
    width: 20px;
    height: 12px;
    background: linear-gradient(
      135deg,
      rgba(100, 200, 255, 0.4),
      rgba(100, 200, 255, 0.1)
    );
    border-radius: 50% 50% 40% 40%;
    transform: rotate(-10deg);
    z-index: 2;
  }

  /* Helmet details */
  &::after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 8px;
    background: #495057;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.astronaut-body {
  width: 35px;
  height: 45px;
  background: linear-gradient(135deg, #ffffff, #f1f3f4);
  border-radius: 15px 15px 5px 5px;
  position: absolute;
  top: 35px;
  left: 2.5px;
  box-shadow: inset -2px -2px 8px rgba(0, 0, 0, 0.15),
    inset 2px 2px 8px rgba(255, 255, 255, 0.8);

  /* Space suit details */
  &::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 15px;
    background: #6c757d;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 8px;
    background: #495057;
    border-radius: 3px;
  }
}

/* Astronaut arms */
.astronaut-arm {
  position: absolute;
  width: 8px;
  height: 25px;
  background: linear-gradient(135deg, #ffffff, #f1f3f4);
  border-radius: 4px;

  &.left {
    top: 40px;
    left: -6px;
    transform: rotate(-30deg);
    animation: arm-float-left 8s ease-in-out infinite;
  }

  &.right {
    top: 40px;
    right: -6px;
    transform: rotate(30deg);
    animation: arm-float-right 8s ease-in-out infinite;
  }
}

/* Oxygen tank */
.astronaut-tank {
  position: absolute;
  top: 45px;
  right: -8px;
  width: 12px;
  height: 25px;
  background: linear-gradient(135deg, #6c757d, #495057);
  border-radius: 3px;

  &::before {
    content: "";
    position: absolute;
    top: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 5px;
    background: #495057;
    border-radius: 2px;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 8px;
    background: #343a40;
    border-radius: 1px;
  }
}

/* Floating animation with subtle rotation */
@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(-40px, -50px) rotate(3deg); // Increased range
  }
  40% {
    transform: translate(30px, -70px) rotate(-2deg); // Increased range
  }
  60% {
    transform: translate(-20px, -30px) rotate(1deg); // Increased range
  }
  80% {
    transform: translate(50px, -60px) rotate(-3deg); // Increased range
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

/* Arm animations */
@keyframes arm-float-left {
  0%,
  100% {
    transform: rotate(-30deg);
  }
  20% {
    transform: rotate(-50deg) translateY(-5px);
  } // Enhanced movement
  40% {
    transform: rotate(-20deg) translateY(3px);
  } // Enhanced movement
  60% {
    transform: rotate(-40deg) translateY(-2px);
  } // Enhanced movement
  80% {
    transform: rotate(-25deg) translateY(4px);
  } // Enhanced movement
}

@keyframes arm-float-right {
  0%,
  100% {
    transform: rotate(30deg);
  }
  20% {
    transform: rotate(50deg) translateY(-5px);
  } // Enhanced movement
  40% {
    transform: rotate(20deg) translateY(3px);
  } // Enhanced movement
  60% {
    transform: rotate(40deg) translateY(-2px);
  } // Enhanced movement
  80% {
    transform: rotate(25deg) translateY(4px);
  } // Enhanced movement
}

/* Add subtle glow effect */
.astronaut-helmet::before {
  animation: helmet-glow 4s ease-in-out infinite;
}

@keyframes helmet-glow {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

// Add glow effect when dragging
.floating-astronaut.dragging .astronaut-helmet::before {
  animation: drag-glow 0.5s ease-in-out infinite alternate;
}

@keyframes drag-glow {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.8;
  }
}

// Mobile touch improvements
@media (max-width: 768px) {
  .floating-astronaut {
    animation: float-mobile 10s ease-in-out infinite;
  }

  @keyframes float-mobile {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(-20px, -30px) rotate(2deg);
    }
    50% {
      transform: translate(15px, -40px) rotate(-1deg);
    }
    75% {
      transform: translate(-10px, -25px) rotate(1deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }
}

/* Satellite */
.satellite {
  position: absolute;
  top: 60%;
  left: 60%;
  animation: orbit 15s linear infinite;
}

.satellite-body {
  width: 20px;
  height: 10px;
  background: #ccc;
  border-radius: 5px;
}

.satellite-panel {
  width: 30px;
  height: 5px;
  background: #aaa;
  position: absolute;
  top: 2px;
  left: -5px;
}

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(80px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(80px) rotate(-360deg);
  }
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

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.secret-message {
  background: rgba(157, 123, 255, 0.1);
  border-left: 3px solid #9d7bff;
  padding: 15px;
  margin: 20px 0;
  font-style: italic;
}

.hint,
.hint-text {
  font-size: 0.9em;
  opacity: 0.7;
  margin-top: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .moon {
    width: 100px;
    height: 100px;
    top: 10px;
    right: 10px;
  }

  .floating-astronaut,
  .satellite {
    display: none;
  }
}

.moon::after {
  content: "";
  position: absolute;
  top: -25%;
  left: -25%;
  width: 150%;
  height: 150%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(245, 243, 206, 0.1) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: -1;
}

.moon.gravity-zone::after {
  opacity: 0.3;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
