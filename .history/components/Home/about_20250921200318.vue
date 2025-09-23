<template>
  <section class="container-dark text-light py-5">
    <div class="container">
      <div class="row align-items-center">
        <!-- Photo -->
        <div class="col-lg-6 mb-4 mb-lg-0 text-center">
          <UiParticleImage
            particle-size="40"
            particle-gap="4"
            src="/2.png"
            class="img-fluid rounded-circle border border-info"
          />
        </div>

        <!-- Info -->
        <div class="col-lg-6">
          <div class="p-4">
            <h1 class="display-4 name">Wissam Najjom</h1>
            <p class="lead">
              I am a highly motivated and passionate person with a keen interest
              in front-end web development. I am a quick learner and have
              developed my skills through self-learning, I am proficient in
              problem-solving and enjoy finding creative solutions to complex
              issues. I am a team player and enjoy collaborating with others to
              achieve common goals, And most important I love what I do !
            </p>
          </div>
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
