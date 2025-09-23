<template>
  <section class="bg-dark text-light py-5">
    <div
      class="container d-flex flex-column flex-md-row align-items-center gap-4"
    >
      <!-- Photo -->
      <div class="flex-shrink-0">
        <UiParticleImage src="photoUrl" />
      </div>

      <!-- Info -->
      <div>
        <h1 class="display-4 text-info">Wissam Najjom</h1>
        <p class="lead">
          Hi! I'm Wissam Najjom, a passionate front-end developer creating
          interactive and user-friendly web experiences. I enjoy turning ideas
          into reality with modern JavaScript frameworks.
        </p>
        <p>
          <strong>Skills:</strong> Vue.js, Nuxt 3, JavaScript, HTML, CSS,
          Bootstrap, and more.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.bg-dark {
  background-color: #0a0a0a !important;
}

.text-info {
  color: #04678a !important;
}

@media (max-width: 768px) {
  img {
    width: 150px !important;
    height: 150px !important;
  }
}
</style>
