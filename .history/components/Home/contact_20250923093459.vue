<template>
  <section
    class="relative py-20 bg-gradient-to-br from-purple-900 via-black to-gray-900"
  >
    <div class="container mx-auto px-6 lg:px-20">
      <!-- Header -->
      <h2
        class="text-4xl md:text-5xl font-extrabold text-center text-white mb-12"
        data-aos="fade-down"
      >
        Let’s <span class="text-purple-400">Connect</span> ✨
      </h2>

      <!-- Form -->
      <form
        @submit.prevent="handleSubmit"
        class="max-w-2xl mx-auto p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20 space-y-6"
        data-aos="zoom-in-up"
      >
        <!-- Name -->
        <div class="relative">
          <input
            type="text"
            v-model="form.name"
            required
            class="peer w-full p-4 bg-transparent border-b-2 border-gray-500 text-white placeholder-transparent focus:outline-none focus:border-purple-400"
            placeholder="Your Name"
          />
          <label
            class="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-400"
          >
            Your Name
          </label>
        </div>

        <!-- Email -->
        <div class="relative">
          <input
            type="email"
            v-model="form.email"
            required
            class="peer w-full p-4 bg-transparent border-b-2 border-gray-500 text-white placeholder-transparent focus:outline-none focus:border-purple-400"
            placeholder="Email"
          />
          <label
            class="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-400"
          >
            Email
          </label>
        </div>

        <!-- Message -->
        <div class="relative">
          <textarea
            v-model="form.message"
            required
            rows="4"
            class="peer w-full p-4 bg-transparent border-b-2 border-gray-500 text-white placeholder-transparent focus:outline-none focus:border-purple-400"
            placeholder="Message"
          ></textarea>
          <label
            class="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-400"
          >
            Message
          </label>
        </div>

        <!-- Hidden Web3Forms Access Key -->
        <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />

        <!-- Button -->
        <button
          type="submit"
          class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          🚀 Send Message
        </button>

        <!-- Toast -->
        <p
          v-if="successMessage"
          class="text-green-400 text-center mt-4 animate-pulse"
        >
          {{ successMessage }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

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
input:focus,
textarea:focus {
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.6);
}
</style>
