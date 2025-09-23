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
              in front-end web development. And most important I
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

    // Random starting X (within viewport width)
    const startX = Math.random() * window.innerWidth;
    heart.style.left = startX + "px";
    heart.style.top = window.innerHeight - 50 + "px";

    // Random size
    const size = 22 + Math.random() * 25 + "px";
    heart.style.fontSize = size;

    // Random drift, duration, and wobble
    heart.style.setProperty("--drift", Math.random() * 300 - 150 + "px");
    heart.style.setProperty("--duration", 6 + Math.random() * 5 + "s");
    heart.style.setProperty("--wobble", Math.random() * 30 - 15 + "deg");

    // Toggle pause/resume when clicked
    heart.addEventListener("click", () => {
      if (heart.classList.contains("paused")) {
        heart.classList.remove("paused");
        heart.classList.add("flying");
      } else {
        heart.classList.remove("flying");
        heart.classList.add("paused");
      }
    });

    document.body.appendChild(heart);

    // Clean up after animation
    setTimeout(() => heart.remove(), 14000);
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

/* HEARTS */
.heart {
  position: fixed;
  user-select: none;
  cursor: pointer;
  z-index: 9999;
  bottom: 0;
  transform-origin: center;
  will-change: transform, opacity;
}

/* Flying */
.heart.flying {
  animation: flyUp var(--duration) ease-in-out forwards,
    wobble 2s infinite ease-in-out;
}

/* Paused */
.heart.paused {
  animation-play-state: paused !important;
}

/* Balloon-like float */
@keyframes flyUp {
  0% {
    transform: translateY(0) translateX(0) scale(1) rotate(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-50vh) translateX(var(--drift)) scale(1.3)
      rotate(var(--wobble));
    opacity: 0.9;
  }
  100% {
    transform: translateY(-120vh) translateX(calc(var(--drift) * -0.5))
      scale(1.6) rotate(calc(var(--wobble) * -0.5));
    opacity: 0;
  }
}

/* Gentle side-to-side wobble */
@keyframes wobble {
  0% {
    transform: translateX(0) rotate(0);
  }
  50% {
    transform: translateX(10px) rotate(3deg);
  }
  100% {
    transform: translateX(-10px) rotate(-3deg);
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
