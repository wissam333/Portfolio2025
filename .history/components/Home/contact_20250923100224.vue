<template>
  <section class="contact-section py-5 position-relative">
    <div class="moon">
      <img src="/5.png" alt="" />
    </div>
    <!-- Night Sky Background -->
    <div class="night-bg"></div>

    <div class="container position-relative" style="z-index: 2">
      <div class="row align-items-center">
        <!-- Form -->
        <div
          class="col-lg-6 mb-5 mb-lg-0"
          data-aos="fade-right"
          data-aos-duration="1500"
        >
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
        <div
          class="col-lg-6 text-center text-light"
          data-aos="fade-left"
          data-aos-duration="1500"
        >
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
const form = ref({
  name: "",
  email: "",
  message: "",
});

const successMessage = ref("");

const handleSubmit = async () => {
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "YOUR_WEB3FORMS_KEY", // get free key from web3forms.com
        ...form.value,
      }),
    });

    const data = await res.json();
    if (data.success) {
      successMessage.value = "✨ Thank you! Your message has been sent.";
      form.value = { name: "", email: "", message: "" };
    }
  } catch (error) {
    successMessage.value = "⚠️ Something went wrong. Please try again.";
  }
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

/* Add stars */
.night-bg::before,
.night-bg::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background: transparent
    url("https://www.transparenttextures.com/patterns/stardust.png") repeat;
  opacity: 0.3;
}

/* Highlight text */
.text-highlight {
  color: #9d7bff;
}

/* Inputs - night glow */
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

/* Moon Illustration */
.night-illustration {
  font-size: 5rem;
  color: #f4e99b;
}

.moon {
  position: absolute;
  top: 0;
  inset-inline-end: 0;
  z-index: 2;

  img {
    animation: moon 10s linear infinite;
    width: 300px;
  }
}
@keyframes moon {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
