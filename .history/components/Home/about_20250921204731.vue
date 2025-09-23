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
          <div class="content">
            <div class="d-flex flex-wrap align-items-center">
              <!-- Sparkles component (hidden on small screens) -->
              <UiSparklesText
                text="Wissam Najjom"
                :colors="{ first: '#ff6ec4', second: '#7873f5' }"
                :sparkles-count="10"
                class="name sparkles-name"
                aria-hidden="true"      <!-- decorative -->
              />

              <!-- Plain text fallback (shown only on small screens) -->
              <span class="name plain-name" aria-hidden="false">Wissam Najjom</span>
            </div>

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

<style lang="scss" scoped>
.container-dark {
  background: linear-gradient(to bottom, #000, #0a0a0a);
}

/* Keep your image adjustments for small screens */
@media (max-width: 768px) {
  .img-fluid {
    max-width: 200px !important;
    height: 300px !important;
  }
}

/* Shared "name" styling (applies to both sparkles and fallback so they match) */
.content {
  padding-inline-start: 40px;

  .name {
    font-size: 4rem;
    font-weight: bold;
    margin: 1rem 0;
    position: relative;
    display: inline-block;
    background: linear-gradient(
      90deg,
      #246145a4 0%,
      #64ffda 40%,
      #59bc90,
      #64ffda
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShine 4s linear infinite;
  }

  .lead {
    font-size: 16px;
  }
}

/* --- Responsive show/hide --- */
/* Default: show sparkles, hide plain text fallback */
.plain-name {
  display: none;
}

/* On screens < 768px: hide the sparkles component and show plain text */
@media (max-width: 767.98px) {
  .sparkles-name {
    display: none !important; /* ensure nested component root is hidden */
  }

  .plain-name {
    display: inline-block !important;
    /* on small screens we probably want a smaller font-size */
    font-size: 2.25rem; /* adjust as needed */
    -webkit-text-fill-color: unset; /* show normal text color */
    background: none;
    -webkit-background-clip: initial;
    color: #fff; /* or whatever matches your theme */
  }

  /* optional: reduce left padding on very small screens */
  .content {
    padding-inline-start: 0;
  }
}

/* keep your textShine keyframes if you use them */
@keyframes textShine {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
</style>
