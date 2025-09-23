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
              in front-end web development... And most important I
              <span class="love-word" @mouseenter="releaseHearts">love</span>
              what I do !
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
function releaseHearts() {
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement("span");
    heart.className = "heart flying";
    heart.innerText = "❤️";

    // Random starting position
    const startX = Math.random() * window.innerWidth;
    heart.style.left = `${startX}px`;
    heart.style.top = `${window.innerHeight}px`;

    // Random size
    heart.style.fontSize = `${20 + Math.random() * 20}px`;

    // Random drift & duration
    heart.style.setProperty("--drift", `${Math.random() * 200 - 100}px`);
    heart.style.setProperty("--duration", `${5 + Math.random() * 5}s`);

    // Toggle pause/resume
    heart.addEventListener("click", () => {
      if (heart.style.animationPlayState === "paused") {
        heart.style.animationPlayState = "running";
      } else {
        heart.style.animationPlayState = "paused";
      }
    });

    document.body.appendChild(heart);

    // Remove after animation
    setTimeout(() => heart.remove(), 12000);
  }
}
</script>

<style scoped lang="scss">
.love-word {
  color: #ff6ec4;
  font-weight: bold;
  cursor: pointer;
  position: relative;
}

/* Heart styles */
.heart {
  position: fixed;
  bottom: 0;
  user-select: none;
  pointer-events: auto;
  z-index: 9999;
  animation: fly var(--duration) ease-in forwards;
  will-change: transform, opacity;
}

@keyframes fly {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-50vh) translateX(var(--drift)) scale(1.3);
    opacity: 0.9;
  }
  100% {
    transform: translateY(-120vh) translateX(calc(var(--drift) * -0.5))
      scale(1.6);
    opacity: 0;
  }
}
</style>
