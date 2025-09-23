<template>
  <section class="container-dark text-light py-5">
    <div class="container">
      <div class="row align-items-center">
        <!-- Photo -->
        <div class="col-lg-6 mb-4 mb-lg-0 text-center">
          <UiParticleImage
            particle-size="2"
            src="/2.png"
            class="img-fluid rounded-circle border border-info"
          />
        </div>

        <!-- Info -->
        <div class="col-lg-6">
          <h1 class="display-4 name">Wissam Najjom</h1>
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
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.container-dark {
  background: linear-gradient(to bottom, #000, #0a0a0a);
}

.name {
  color: #692b3c;
}

@media (max-width: 768px) {
  .img-fluid {
    max-width: 200px !important;
  }
}
</style>
