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

            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" />

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

            <div v-if="showSuccess" class="success-message mt-3">
              <div class="success-icon">✓</div>
              <p>Message sent successfully! I'll get back to you soon.</p>
            </div>
          </form>
        </div>

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
          </div>
          <p class="mt-3 fst-italic">
            Let your words travel across the night sky to reach me.
          </p>

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
import { ref, onMounted } from 'vue';

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

// Physics constants - Fixed to avoid window reference before mount
const GRAVITY = 0.2;
const FRICTION = 0.98;
const BOUNCE = 0.7;
const MOON_GRAVITY = 0.05;
const MOON_RADIUS = 75;
const MOON_CENTER = ref({ x: 0, y: 0 }); // Will be set on mount

// Initialize moon position after mount
onMounted(() => {
  if (container.value) {
    const containerRect = container.value.getBoundingClientRect();
    astronautPosition.value = {
      x: containerRect.width * 0.3 - 25,
      y: containerRect.height * 0.2 - 50,
    };
    
    // Set moon position relative to container
    MOON_CENTER.value = { 
      x: containerRect.width - 115, 
      y: 95 
    };
  }
});

const toggleEclipse = () => {
  isEclipse.value = !isEclipse.value;
};

const handleSubmit = (e) => {
  e.preventDefault();
  isSending.value = true;

  setTimeout(() => {
    isSending.value = false;
    showSuccess.value = true;
    formData.value = { name: "", email: "", message: "" };

    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);
  }, 2000);
};

const animateInput = (e) => {
  const input = e.target;
  input.parentElement.classList.add("focused");
  setTimeout(() => {
    input.parentElement.classList.remove("focused");
  }, 1000);
};

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
  const currentX = e.clientX - containerRect.left;
  const currentY = e.clientY - containerRect.top;

  astronautPosition.value = {
    x: currentX - dragOffset.value.x,
    y: currentY - dragOffset.value.y,
  };

  addThrusterParticle();
};

const onDragTouch = (e) => {
  if (!isDragging.value || e.touches.length === 0) return;

  const containerRect = container.value.getBoundingClientRect();
  const currentX = e.touches[0].clientX - containerRect.left;
  const currentY = e.touches[0].clientY - containerRect.top;

  astronautPosition.value = {
    x: currentX - dragOffset.value.x,
    y: currentY - dragOffset.value.y,
  };

  addThrusterParticle();
};

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    isPhysicsActive.value = true;
    astronautScale.value = 1;
    checkMoonLanding();
  }
};

// Simplified physics to reduce shaking
const updatePhysics = () => {
  if (!isPhysicsActive.value) return;

  astronautVelocity.value.y += GRAVITY;
  astronautVelocity.value.x *= FRICTION;
  astronautVelocity.value.y *= FRICTION;

  astronautPosition.value.x += astronautVelocity.value.x;
  astronautPosition.value.y += astronautVelocity.value.y;

  astronautRotation.value = astronautVelocity.value.x * 0.5;

  // Stop physics when velocity is very small
  if (Math.abs(astronautVelocity.value.x) < 0.1 && Math.abs(astronautVelocity.value.y) < 0.1) {
    astronautVelocity.value = { x: 0, y: 0 };
    isPhysicsActive.value = false;
  }

  checkMoonLanding();
};

const checkMoonLanding = () => {
  const astronautCenter = {
    x: astronautPosition.value.x + 25,
    y: astronautPosition.value.y + 50,
  };

  const distance = Math.sqrt(
    Math.pow(astronautCenter.x - MOON_CENTER.value.x, 2) +
    Math.pow(astronautCenter.y - MOON_CENTER.value.y, 2)
  );

  if (distance < MOON_RADIUS) {
    isAstronautOnMoon.value = true;
    showEasterEgg.value = true;
    isPhysicsActive.value = false;
    astronautVelocity.value = { x: 0, y: 0 };

    setTimeout(() => {
      showEasterEgg.value = false;
    }, 5000);
  } else {
    isAstronautOnMoon.value = false;
  }
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
  thrusterParticles.value = thrusterParticles.value
    .map((particle) => {
      particle.y += 2;
      particle.opacity = particle.life / 20;
      particle.life--;
      return particle;
    })
    .filter((particle) => particle.life > 0);
};

// Use requestAnimationFrame instead of useRafFn for simplicity
let animationFrameId;

const animate = () => {
  updatePhysics();
  updateParticles();
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  animate();
});

// Clean up animation frame
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.contact-section {
  background: linear-gradient(135deg, #0c0c2d 0%, #1a1a3e 100%);
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Moon Styles */
.moon {
  position: absolute;
  top: 50px;
  right: 100px;
  width: 150px;
  height: 150px;
  background: linear-gradient(145deg, #d0d0d0, #a0a0a0);
  border-radius: 50%;
  box-shadow: 
    0 0 40px rgba(255, 255, 255, 0.3),
    inset -20px -20px 40px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 3;
  transition: all 0.5s ease;
}

.moon.eclipse {
  background: linear-gradient(145deg, #ff6b00, #ff0000);
  box-shadow: 
    0 0 60px rgba(255, 107, 0, 0.6),
    inset -20px -20px 40px rgba(139, 0, 0, 0.4);
}

.moon-crater {
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.moon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%);
}

/* Astronaut Styles */
.floating-astronaut {
  position: absolute;
  width: 50px;
  height: 100px;
  transition: transform 0.1s ease;
  z-index: 10;
}

.astronaut-helmet {
  position: absolute;
  top: 0;
  left: 10px;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.astronaut-body {
  position: absolute;
  top: 25px;
  left: 5px;
  width: 40px;
  height: 50px;
  background: white;
  border-radius: 10px;
}

.astronaut-arm {
  position: absolute;
  top: 30px;
  width: 15px;
  height: 30px;
  background: white;
  border-radius: 5px;
  transition: transform 0.3s ease;
}

.astronaut-arm.left {
  left: -5px;
  transform-origin: right center;
}

.astronaut-arm.right {
  right: -5px;
  transform-origin: left center;
}

.astronaut-tank {
  position: absolute;
  top: 40px;
  right: -10px;
  width: 20px;
  height: 30px;
  background: #4a90e2;
  border-radius: 5px;
}

/* Night Sky */
.night-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
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
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: shooting-star linear infinite;
}

@keyframes shooting-star {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateX(100vw) translateY(100vh);
    opacity: 0;
  }
}

/* Container */
.night-illustration {
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* Form Styles */
.contact-form {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1) !important;
}

.creative-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.creative-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  color: white;
}

.send-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Particle Effects */
.thruster-particle {
  position: absolute;
  background: linear-gradient(45deg, #00ffff, #0088ff);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
}

.moon-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 4;
}

/* Responsive */
@media (max-width: 768px) {
  .moon {
    width: 100px;
    height: 100px;
    top: 20px;
    right: 20px;
  }
  
  .night-illustration {
    height: 300px;
  }
  
  .floating-astronaut {
    transform: scale(0.8);
  }
}
</style>