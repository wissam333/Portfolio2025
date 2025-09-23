<template>
  <section class="contact-section py-5 position-relative">
    <!-- Clickable Moon -->
    <div class="moon" @click="moonClicked = !moonClicked">
      <img
        src="/moon.png"
        alt="Moon"
        :class="{ 'moon-hole': moonClicked }"
      />
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

            <button type="submit" class="btn send-btn w-100">
              🌌 Send Message
            </button>
          </form>
        </div>

        <!-- Side -->
        <div class="col-lg-6 text-center text-light">
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

const moonClicked = ref(false);
</script>

<style lang="scss" scoped>
.contact-section {
  position: relative;
}

/* Background */
.night-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, #1a1a2e, #0d0d0d);
  z-index: 1;
}

.night-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("https://www.transparenttextures.com/patterns/stardust.png")
    repeat;
  opacity: 0.3;
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

/* Button */
.send-btn {
  background: linear-gradient(90deg, #1e1e2f, #3a2e5f);
  border: 1px solid #9d7bff;
  color: #fff;
  font-weight: bold;
  padding: 12px;
  border-radius: 6px;
}

/* Moon */
.moon {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 3;
  cursor: pointer;

  img {
    width: 250px;
    transition: all 0.8s ease-in-out;
  }

  /* Easter egg effect */
  .moon-hole {
    filter: brightness(0.4) contrast(1.2);
    clip-path: circle(80px at 50% 50%);
    box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.9);
  }
}
</style>
