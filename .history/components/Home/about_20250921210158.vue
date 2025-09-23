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
            <UiSparklesText
              text="Wissam Najjom"
              :colors="{ first: '#ff6ec4', second: '#7873f5' }"
              :sparkles-count="10"
              class="name sparkles-name"
              aria-hidden="true"
            />

            <span class="name plain-name" aria-hidden="false">
              Wissam Najjom
            </span>

            <p class="lead">
              I am a highly motivated and passionate person with a keen interest
              in front-end web development. I am a quick learner and have
              developed my skills through self-learning, I am proficient in
              problem-solving and enjoy finding creative solutions to complex
              issues. I am a team player and enjoy collaborating with others to
              achieve common goals, And most important I
              <span class="love-word" @mouseenter="releaseHearts">love</span>
              what I do !
            </p>

            <!-- floating hearts container -->
            <div ref="heartsContainer" class="hearts-container"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const heartsContainer = ref(null);

function releaseHearts() {
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.innerHTML = "❤️";

    // Random horizontal position
    heart.style.left = Math.random() * 80 + 10 + "%";

    // Random size
    const size = 18 + Math.random() * 20 + "px";
    heart.style.fontSize = size;

    // Random animation
    const duration = 3 + Math.random() * 3;
    heart.style.animationDuration = duration + "s";
    heart.style.setProperty("--x-move", Math.random() * 60 - 30 + "px"); // drift left/right
    heart.style.setProperty("--rotate", Math.random() * 40 - 20 + "deg");

    heartsContainer.value.appendChild(heart);

    // remove after animation
    setTimeout(() => heart.remove(), duration * 1000);
  }
}
</script>

<style lang="scss" scoped>
.container-dark {
  background: linear-gradient(to bottom, #000, #0a0a0a);
}

@media (max-width: 768px) {
  .img-fluid {
    max-width: 200px !important;
    height: 300px !important;
  }
}

.content {
  padding-inline-start: 40px;

  .name {
    text-align: center;
    font-size: 4rem;
    font-weight: bold;
    margin: 1rem 0;
    position: relative;
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
    margin-top: 30px;
    text-align: center;
  }
}

.love-word {
  color: #ff6ec4;
  font-weight: bold;
  cursor: pointer;
  position: relative;
}

/* hearts floating */
.hearts-container {
  position: relative;
}

.heart {
  position: absolute;
  bottom: 0;
  pointer-events: none;
  animation: floatUp ease-in-out forwards;
  opacity: 0.9;
}

/* smoother and creative floating */
@keyframes floatUp {
  0% {
    transform: translateX(0) translateY(0) scale(0.8) rotate(0);
    opacity: 1;
  }
  50% {
    transform: translateX(var(--x-move)) translateY(-120px) scale(1.2) rotate(var(--rotate));
    opacity: 0.9;
  }
  100% {
    transform: translateX(calc(var(--x-move) * -0.5)) translateY(-250px) scale(1.6) rotate(calc(var(--rotate) * -1));
    opacity: 0;
  }
}

.plain-name {
  display: none !important;
}

@media (max-width: 767.98px) {
  .sparkles-name {
    display: none !important;
  }

  .plain-name {
    display: inline-block !important;
    font-size: 2.2rem !important;
    -webkit-text-fill-color: unset;
    background: none;
    -webkit-background-clip: initial;
    color: #fff;
  }
  .content {
    padding-inline-start: 0;
  }
}
</style>
