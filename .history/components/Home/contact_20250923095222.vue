<template>
  <section class="contact-section py-5 position-relative">
    <!-- Background animation -->
    <div class="animated-bg"></div>

    <div class="container">
      <div class="row align-items-center">
        <!-- Form -->
        <div
          class="col-lg-6 mb-5 mb-lg-0"
          data-aos="fade-right"
          data-aos-duration="1500"
        >
          <h2 class="mb-4 fw-bold text-white">
            Let’s <span class="text-highlight">Create Magic</span> Together ✨
          </h2>

          <form
            action="https://formsubmit.co/YOUR_EMAIL_HASH"
            method="POST"
            class="p-4 rounded shadow-lg bg-dark text-white position-relative"
          >
            <div class="mb-3 position-relative">
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
              <span>Send Message</span>
              <i class="bi bi-send-fill ms-2"></i>
            </button>
          </form>
        </div>

        <!-- Creative Side -->
        <div
          class="col-lg-6 text-center"
          data-aos="fade-left"
          data-aos-duration="1500"
        >
          <div class="floating-illustration">🚀</div>
          <p class="mt-3 text-light fst-italic">
            Your message launches straight to my inbox!
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

<style scoped>
/* Background animation */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top left, #5a2ac9, transparent 50%),
    radial-gradient(circle at bottom right, #e91e63, transparent 50%);
  animation: moveBg 12s infinite alternate;
  z-index: 0;
}

@keyframes moveBg {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-50px, 50px);
  }
}

/* Highlight text */
.text-highlight {
  color: #ff7ee2;
}

/* Form creative inputs */
.creative-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #666;
  color: #fff;
  transition: all 0.3s ease-in-out;
}

.creative-input:focus {
  border-color: #ff7ee2;
  box-shadow: 0 0 15px rgba(255, 126, 226, 0.4);
}

/* Send button */
.send-btn {
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  border: none;
  color: white;
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
}

.send-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}

/* Rocket animation */
.floating-illustration {
  font-size: 5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
