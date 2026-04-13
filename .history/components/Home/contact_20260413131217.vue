<template>
  <section class="contact-section py-5 position-relative" id="contact">
    <!-- Shooting Stars -->
    <div class="shooting-stars">
      <div
        v-for="n in 5"
        :key="n"
        class="shooting-star"
        :style="`--delay: ${n * 2}s; --duration: ${3 + n}s;`"
      />
    </div>

    <!-- Eclipse Effect -->
    <div class="eclipse-overlay" :class="{ active: isEclipse }" />

    <div
      ref="moonEl"
      class="moon"
      :class="{
        eclipse: isEclipse,
        'moon-glow-effect': isAstronautOnMoon,
        'gravity-zone': isPhysicsActive && !isAstronautOnMoon,
      }"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="moon-crater"
        :style="craterStyles[n - 1]"
      />
      <div class="moon-glow" />
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
      />
    </div>

    <!-- Night Sky -->
    <div class="night-bg">
      <div class="stars">
        <div v-for="n in 50" :key="n" class="star" :style="starStyles[n - 1]" />
      </div>
      <div
        class="constellation constellation-orion"
        :style="constellationStyle"
      >
        <div
          v-for="(star, i) in orionStars"
          :key="'s' + i"
          class="constellation-star"
          :style="{ top: star.y + '%', left: star.x + '%' }"
        />
        <div
          v-for="(line, i) in orionLines"
          :key="'l' + i"
          class="constellation-line"
          :style="`top:${line.startY}%;left:${line.startX}%;width:${line.width}%;transform:rotate(${line.angle}deg)`"
        />
      </div>
    </div>

    <div class="container" style="z-index: 2">
      <div class="row align-items-center contact-main-row">
        <!-- Form -->
        <div class="col-lg-6 mb-5 mb-lg-0 form">
          <h2 class="mb-4 fw-bold text-white">
            {{ $i18n.locale === "ar" ? "اتصل بي" : "Contact Me" }}
            <span class="text-highlight">
              {{
                $i18n.locale === "ar" ? "عن طريق البريد الإلكتروني" : "By Email"
              }}
              ✨
            </span>
          </h2>

          <form
            action="https://formsubmit.co/18aef7e8cffd038a8d44aa69bd4c869e"
            method="POST"
            class="p-4 rounded shadow-lg bg-dark text-white border border-secondary contact-form"
            @submit="handleSubmit"
          >
            <div class="mb-3">
              <label class="form-label">{{
                $i18n.locale === "ar" ? "اسمك" : "Your Name"
              }}</label>
              <input
                type="text"
                name="name"
                class="form-control creative-input"
                :placeholder="
                  $i18n.locale === 'ar' ? 'أدخل اسمك' : 'Enter your name'
                "
                required
                v-model="formData.name"
                @focus="animateInput"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">{{
                $i18n.locale === "ar" ? "البريد الإلكتروني" : "Email"
              }}</label>
              <input
                type="email"
                name="email"
                class="form-control creative-input"
                :placeholder="
                  $i18n.locale === 'ar'
                    ? 'أدخل بريدك الإلكتروني'
                    : 'Enter your email'
                "
                required
                v-model="formData.email"
                @focus="animateInput"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">{{
                $i18n.locale === "ar" ? "الرسالة" : "Message"
              }}</label>
              <textarea
                name="message"
                rows="4"
                class="form-control creative-input"
                :placeholder="
                  $i18n.locale === 'ar'
                    ? 'اكتب رسالتك...'
                    : 'Type your message...'
                "
                required
                v-model="formData.message"
                @focus="animateInput"
              />
            </div>

            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_next"
              value="https://portfolio2025-topaz-psi.vercel.app/"
            />
            <input
              type="hidden"
              name="_autoresponse"
              :value="
                $i18n.locale === 'ar'
                  ? 'مرحباً، هذه رسالة رد تلقائي. سأرد على رسالتك خلال ثلاثة أيام كحد أقصى.'
                  : 'Hey, this is an automatic reply. I will reply within 3 days at most.'
              "
            />

            <button
              type="submit"
              class="btn send-btn w-100"
              :class="{ sending: isSending }"
            >
              <span v-if="!isSending">
                🌌 {{ $i18n.locale === "ar" ? "أرسل رسالة" : "Send Message" }}
              </span>
              <span v-else class="sending-text">
                <span class="spinner" />
                {{ $i18n.locale === "ar" ? "إرسال..." : "Sending..." }}
              </span>
            </button>

            <Transition name="success-fade">
              <div v-if="showSuccess" class="success-message mt-3">
                <div class="success-icon">✓</div>
                <p>
                  {{
                    $i18n.locale === "ar"
                      ? "تم إرسال الرسالة بنجاح! سأتواصل معك قريبًا."
                      : "Message sent successfully! I'll get back to you soon."
                  }}
                </p>
              </div>
            </Transition>
          </form>
        </div>

        <!-- Creative Side -->
        <div class="col-lg-6 text-center text-light effect-layer">
          <div class="night-illustration" ref="container">
            <div
              class="floating-astronaut"
              ref="astronautEl"
              :style="{
                left: astronautPosition.x + 'px',
                top: astronautPosition.y + 'px',
                transform: `rotate(${astronautRotation}deg) scale(${astronautScale})`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }"
              :class="{
                dragging: isDragging,
                'on-moon': isAstronautOnMoon,
                'physics-active': isPhysicsActive,
              }"
              @mousedown="startDrag"
              @touchstart.prevent="startDragTouch"
            >
              <div class="astronaut-helmet" />
              <div class="astronaut-body" />
              <div
                class="astronaut-arm left"
                :style="{ transform: `rotate(${leftArmRotation}deg)` }"
              />
              <div
                class="astronaut-arm right"
                :style="{ transform: `rotate(${rightArmRotation}deg)` }"
              />
              <div
                class="astronaut-leg left"
                :style="{ transform: `rotate(${leftLegRotation}deg)` }"
              />
              <div
                class="astronaut-leg right"
                :style="{ transform: `rotate(${rightLegRotation}deg)` }"
              />
              <div class="astronaut-tank" />
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
              />
            </div>

            <div
              class="satellite"
              :style="`animation-delay:${satelliteDelay}s`"
            >
              <div class="satellite-body" />
              <div class="satellite-panel" />
            </div>
          </div>

          <Transition name="egg-fade">
            <div v-if="showEasterEgg" class="easter-egg-message mt-3">
              <div class="secret-message">
                <p>
                  🚀
                  {{
                    $i18n.locale === "ar"
                      ? "خطوة صغيرة للرجل، وقفزة عملاقة لرسالتك!"
                      : "One small step for man, one giant leap for your message!"
                  }}
                </p>
                <small class="hint-text">
                  {{
                    $i18n.locale === "ar"
                      ? "لقد هبط رائد الفضاء على القمر!"
                      : "The astronaut has landed on the moon!"
                  }}
                </small>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRafFn } from "@vueuse/core";
import confetti from "canvas-confetti";

// ── Static data (computed once, not reactive) ─────────────────────────────────
const craterStyles = Array.from({ length: 8 }, () => ({
  width: `${Math.random() * 20 + 5}px`,
  height: `${Math.random() * 20 + 5}px`,
  top: `${Math.random() * 70 + 15}%`,
  left: `${Math.random() * 70 + 15}%`,
}));

const starStyles = Array.from({ length: 50 }, () => ({
  top: `${Math.random() * 120 - 10}%`,
  left: `${Math.random() * 120 - 10}%`,
  width: `${Math.random() * 3 + 1}px`,
  height: `${Math.random() * 3 + 1}px`,
  opacity: Math.random() * 0.7 + 0.3,
  animationDelay: `${Math.random() * 5}s`,
}));

const constellationStyle = { opacity: Math.random() * 0.3 + 0.1 };
const satelliteDelay = Math.random() * 10;

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

// ── Physics constants ─────────────────────────────────────────────────────────
const GRAVITY = 0;
const FRICTION = 0.95;
const BOUNCE = 0.5;

// ── Template refs ─────────────────────────────────────────────────────────────
const container = ref(null);
const astronautEl = ref(null);
const moonEl = ref(null);

// ── Form state ────────────────────────────────────────────────────────────────
const isSending = ref(false);
const showSuccess = ref(false);
const formData = ref({ name: "", email: "", message: "" });

// ── Astronaut / physics state ─────────────────────────────────────────────────
const astronautPosition = ref({ x: 150, y: 100 });
const astronautVelocity = ref({ x: 0, y: 0 });
const astronautRotation = ref(0);
const astronautScale = ref(1);
const leftArmRotation = ref(-30);
const rightArmRotation = ref(30);
const leftLegRotation = ref(0);
const rightLegRotation = ref(0);
const isDragging = ref(false);
const isPhysicsActive = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const lastPosition = ref({ x: 0, y: 0 });
const lastTime = ref(0);

// ── Easter egg state ──────────────────────────────────────────────────────────
const isEclipse = ref(true);
const isAstronautOnMoon = ref(false);
const showEasterEgg = ref(false);
const moonParticles = ref([]);
const thrusterParticles = ref([]);
let particleId = 0;

// ── Form handlers ─────────────────────────────────────────────────────────────
const handleSubmit = () => {
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
  const parent = e.target.parentElement;
  parent.classList.add("focused");
  setTimeout(() => parent.classList.remove("focused"), 1000);
};

// ── Drag ──────────────────────────────────────────────────────────────────────
const getPointer = (e) => ({
  x: e.clientX ?? e.touches?.[0]?.clientX,
  y: e.clientY ?? e.touches?.[0]?.clientY,
});

const beginDrag = (clientX, clientY) => {
  isDragging.value = true;
  isPhysicsActive.value = false;
  astronautScale.value = 1.1;

  const rect = astronautEl.value.getBoundingClientRect();
  const containerRect = container.value.getBoundingClientRect();

  dragOffset.value = { x: clientX - rect.left, y: clientY - rect.top };
  lastPosition.value = {
    x: clientX - containerRect.left,
    y: clientY - containerRect.top,
  };
  lastTime.value = Date.now();
};

const startDrag = (e) => {
  e.preventDefault();
  const { x, y } = getPointer(e);
  beginDrag(x, y);
  document.addEventListener("mousemove", onDragGlobal);
  document.addEventListener("mouseup", stopDragGlobal);
};

const startDragTouch = (e) => {
  if (!e.touches.length) return;
  beginDrag(e.touches[0].clientX, e.touches[0].clientY);
  document.addEventListener("touchmove", onDragTouchGlobal, { passive: false });
  document.addEventListener("touchend", stopDragGlobal);
};

const applyDrag = (clientX, clientY) => {
  const containerRect = container.value.getBoundingClientRect();
  const now = Date.now();
  const dt = now - lastTime.value;

  if (dt > 0) {
    const cx = clientX - containerRect.left;
    const cy = clientY - containerRect.top;
    astronautVelocity.value = {
      x: ((cx - lastPosition.value.x) / dt) * 6,
      y: ((cy - lastPosition.value.y) / dt) * 6,
    };
    lastPosition.value = { x: cx, y: cy };
    lastTime.value = now;
  }

  astronautPosition.value = {
    x: clientX - containerRect.left - dragOffset.value.x,
    y: clientY - containerRect.top - dragOffset.value.y,
  };

  addThrusterParticle();
};

const onDragGlobal = (e) => {
  e.preventDefault();
  if (isDragging.value) applyDrag(e.clientX, e.clientY);
};
const onDragTouchGlobal = (e) => {
  e.preventDefault();
  if (isDragging.value && e.touches.length)
    applyDrag(e.touches[0].clientX, e.touches[0].clientY);
};

const stopDragGlobal = () => {
  if (isDragging.value) {
    isDragging.value = false;
    isPhysicsActive.value = true;
    astronautScale.value = 1;
    checkMoonLanding();
  }
  document.removeEventListener("mousemove", onDragGlobal);
  document.removeEventListener("mouseup", stopDragGlobal);
  document.removeEventListener("touchmove", onDragTouchGlobal);
  document.removeEventListener("touchend", stopDragGlobal);
};

// ── Physics ───────────────────────────────────────────────────────────────────
const updatePhysics = () => {
  if (!isPhysicsActive.value) return;

  const v = astronautVelocity.value;
  const p = astronautPosition.value;

  v.y += GRAVITY;
  v.x *= FRICTION;
  v.y *= FRICTION;

  p.x += v.x;
  p.y += v.y;

  astronautRotation.value = v.x * 0.5;
  const t = Date.now() * 0.001;
  leftArmRotation.value = -30 + Math.sin(t * 10) * 20;
  rightArmRotation.value = 30 + Math.cos(t * 10) * 20;
  leftLegRotation.value = -10 + Math.sin(t * 15) * 15;
  rightLegRotation.value = 10 + Math.cos(t * 15) * 15;

  const cRect = container.value?.getBoundingClientRect();
  const aRect = astronautEl.value?.getBoundingClientRect();
  if (cRect && aRect) {
    if (p.x < 0) {
      p.x = 0;
      v.x = -v.x * BOUNCE;
    }
    if (p.x + aRect.width > cRect.width) {
      p.x = cRect.width - aRect.width;
      v.x = -v.x * BOUNCE;
    }
    if (p.y < 0) {
      p.y = 0;
      v.y = -v.y * BOUNCE;
    }
    if (p.y + aRect.height > cRect.height) {
      p.y = cRect.height - aRect.height;
      v.y = -v.y * BOUNCE;
      v.x *= 0.9;
    }
  }

  if (!isAstronautOnMoon.value) checkMoonLanding();

  if (Math.abs(v.x) < 0.1 && Math.abs(v.y) < 0.1) {
    v.x = v.y = 0;
    isPhysicsActive.value = false;
  }
};

// ── Moon landing ──────────────────────────────────────────────────────────────
const checkMoonLanding = () => {
  if (!moonEl.value || !container.value) return;

  const moonRect = moonEl.value.getBoundingClientRect();
  const containerRect = container.value.getBoundingClientRect();
  const moonCenter = {
    x: moonRect.left - containerRect.left + moonRect.width / 2,
    y: moonRect.top - containerRect.top + moonRect.height / 2,
  };
  const moonRadius = moonRect.width / 2;
  const landingRadius = moonRadius * 1.5;
  const astroCenter = {
    x: astronautPosition.value.x + 25,
    y: astronautPosition.value.y + 50,
  };
  const dist = Math.hypot(
    astroCenter.x - moonCenter.x,
    astroCenter.y - moonCenter.y,
  );

  if (dist < landingRadius) {
    isAstronautOnMoon.value = true;
    showEasterEgg.value = true;
    isPhysicsActive.value = false;
    astronautVelocity.value = { x: 0, y: 0 };

    const angle = Math.atan2(
      astroCenter.y - moonCenter.y,
      astroCenter.x - moonCenter.x,
    );
    astronautPosition.value = {
      x: moonCenter.x + Math.cos(angle) * (moonRadius - 10) - 25,
      y: moonCenter.y + Math.sin(angle) * (moonRadius - 10) - 50,
    };
    astronautRotation.value = (angle * 180) / Math.PI + 90;
    triggerMoonLandingEffects(moonRect);
  } else {
    isAstronautOnMoon.value = false;
    showEasterEgg.value = false;
  }
};

const triggerMoonLandingEffects = (moonRect) => {
  isEclipse.value = false;
  if (!useEasterEggs().value.includes(6)) useEasterEggs().value.push(6);

  confetti({
    particleCount: 100,
    spread: 70,
    origin: {
      x: (moonRect.left + moonRect.width / 2) / window.innerWidth,
      y: (moonRect.top + moonRect.height / 2) / window.innerHeight,
    },
    colors: ["#ffffff", "#ffff00", "#cccccc"],
  });

  for (let i = 0; i < 15; i++) createMoonParticle();
};

// ── Particles ─────────────────────────────────────────────────────────────────
const PARTICLE_COLORS = ["#ffffff", "#ffff00", "#ffaa00"];

const createMoonParticle = () => {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 2 + 1;
  moonParticles.value.push({
    id: particleId++,
    x: 75 + Math.cos(angle) * 60, // approx moon center fallback
    y: 75 + Math.sin(angle) * 60,
    size: Math.random() * 4 + 2,
    opacity: 1,
    color: PARTICLE_COLORS[Math.floor(Math.random() * 3)],
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 60,
  });
};

const addThrusterParticle = () => {
  thrusterParticles.value.push({
    id: particleId++,
    x: Math.random() * 40 - 5,
    y: 70 + Math.random() * 10,
    size: Math.random() * 3 + 1,
    opacity: 1,
    life: 20,
  });
};

const updateParticles = () => {
  moonParticles.value = moonParticles.value
    .map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      opacity: (p.life - 1) / 60,
      life: p.life - 1,
    }))
    .filter((p) => p.life > 0);

  thrusterParticles.value = thrusterParticles.value
    .map((p) => ({
      ...p,
      y: p.y + 2,
      opacity: (p.life - 1) / 20,
      life: p.life - 1,
    }))
    .filter((p) => p.life > 0);
};

// ── RAF loop ──────────────────────────────────────────────────────────────────
const { pause, resume } = useRafFn(
  () => {
    updatePhysics();
    updateParticles();
  },
  { immediate: false },
);

watch([isPhysicsActive, isDragging], ([physics, dragging]) => {
  physics || dragging ? resume() : pause();
});

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(() => {
  if (container.value) {
    const { width, height } = container.value.getBoundingClientRect();
    astronautPosition.value = { x: width * 0.3 - 25, y: height * 0.2 - 50 };
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
  will-change: opacity;
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
  text-shadow: 0 0 10px rgba(147, 255, 123, 0.7);
}

/* Inputs */
.creative-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #444;
  color: #fff;
  transition: all 0.3s ease;
  &::placeholder {
    color: #ffffff76;
  }
}

.creative-input:focus {
  border-color: $primary-color;
  box-shadow: 0 0 8px rgba(147, 255, 123, 0.7);
  transform: translateY(-2px);
}

.mb-3 {
  position: relative;
  transition: all 0.3s ease;
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
  border: 1px solid $primary-color;
  color: #fff;
  font-weight: bold;
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
  inset-inline-end: 40px;
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
  inset-inline-start: 0;
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
  inset-inline-start: 0;
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
    transform: scale(1.15);
    filter: drop-shadow(0 0 15px rgba(100, 200, 255, 0.8)) brightness(1.1);
    z-index: 1000;
    transition:
      transform 0.1s ease,
      filter 0.1s ease;
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80px;
      height: 80px;
      background: radial-gradient(
        circle,
        rgba(100, 200, 255, 0.2) 0%,
        transparent 70%
      );
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: cursor-pulse 0.5s ease-out infinite;
      pointer-events: none;
    }
  }

  &:hover:not(.dragging) {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(100, 200, 255, 0.7));
    transition:
      transform 0.2s ease,
      filter 0.2s ease;
  }
  &:not(.dragging) {
    cursor: grab;
  }
}

@keyframes cursor-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
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
  box-shadow:
    inset -3px -3px 10px rgba(0, 0, 0, 0.2),
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
  box-shadow:
    inset -2px -2px 8px rgba(0, 0, 0, 0.15),
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
  border-left: 3px solid $primary-color;
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

.form {
  z-index: 10;
}

@media (max-width: 991px) {
  .contact-main-row {
    flex-direction: column-reverse;
    .effect-layer {
      position: relative;
      height: 400px;
    }
  }
}

/* Astronaut legs */
.astronaut-leg {
  position: absolute;
  width: 8px;
  height: 23px;
  background: linear-gradient(135deg, #ffffff, #f1f3f4);
  border-radius: 4px;
  top: 75px;

  &.left {
    left: 8px;
    transform: rotate(0deg);
  }

  &.right {
    right: 8px;
    transform: rotate(0deg);
  }

  /* Boot details */
  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 8px;
    background: #343a40;
    border-radius: 3px 3px 8px 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}
</style>
