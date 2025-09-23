<template>
  <section class="contact-section py-5 position-relative">
    <!-- 🌙 Moon -->
    <div class="moon" @click="triggerEclipse">
      <img src="/moon.png" alt="moon" />
      <!-- Eclipse overlay -->
      <div class="eclipse" :class="{ active: isEclipse }"></div>
    </div>

    <!-- Night Sky Background -->
    <div class="night-bg"></div>

    <div class="container position-relative" style="z-index: 2">
      <div class="row align-items-center">
        <!-- Form -->
        <div class="col-lg-6 mb-5 mb-lg-0">
          <h2 class="mb-4 fw-bold text-white">
            Contact Me <span class="text-highlight">Under the Stars ✨</span>
          </h2>

          <form
            action="https://formsubmit.co/18aef7e8cffd038a8d44aa69bd4c869e"
            method="POST"
            class="p-4 rounded shadow-lg bg-dark text-white border border-secondary"
          >
            <div class="mb-3">
              <label class="form-label">Your Name</label>
              <input
                type="text"
                name="name"
                class="form-control creative-input"
                placeholder="Enter your name"
                required
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
              ></textarea>
            </div>

            <!-- Hidden fields -->
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_next"
              value="https://yourdomain.com/thanks"
            />

            <!-- Send button -->
            <button type="submit" class="btn send-btn w-100">
              🌌 Send Message
            </button>
          </form>
        </div>

        <!-- Creative Side -->
        <div class="col-lg-6 text-center text-light">
          <div class="night-illustration"></div>
          <p class="mt-3 fst-italic">
            Let your words travel across the night sky to reach me.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const isEclipse = ref(false);

const triggerEclipse = () => {
  if (isEclipse.value) return; // prevent spam clicks
  isEclipse.value = true;
  setTimeout(() => {
    isEclipse.value = false;
  }, 5000); // eclipse lasts 5s
};
</script>

<style lang="scss" scoped>
.contact-section {
  position: relative;
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

.text-highlight {
  color: #9d7bff;
}

/* Inputs */
.creative-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #444;
  color: #fff;
}

.creative-input:focus {
  border-color: #9d7bff;
  box-shadow: 0 0 8px rgba(157, 123, 255, 0.7);
}

/* Send button */
.send-btn {
  background: linear-gradient(90deg, #1e1e2f, #3a2e5f);
  border: 1px solid #9d7bff;
  color: #fff;
  font-weight: bold;
  padding: 12px;
  border-radius: 6px;
}

/* 🌙 Moon */
.moon {
  position: absolute;
  top: 20px;
  right: 40px;
  z-index: 3;
  width: 300px;
  height: 300px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: block;
  }

  /* The eclipse overlay (shadow) */
  .eclipse {
    position: absolute;
    top: 50px;
    left: -110%;
    width: 210px;
    height: 210px;
    border-radius: 50%;
    background: #161623;
    opacity: 0;
    pointer-events: none;
    z-index: 5;
  }

  .eclipse.active {
    animation: lunar-eclipse 5s ease-in-out forwards;
    opacity: 1;
  }
}

/* Eclipse Animation */
@keyframes lunar-eclipse {
  0% {
    left: -140%;
    opacity: 1;
  }
  50% {
    left: 0;
    opacity: 1;
  }
  100% {
    left: 110%;
    opacity: 1;
  }
}
</style>
