<template>
  <div class="home">
    <!-- Falling Stars Background -->
    <div class="stars-container">
      <div class="stars">
        <span v-for="n in 30" :key="n" :style="getStarStyle(n)"></span>
      </div>
    </div>

    <!-- Main content -->
    <main class="content">
      <div class="type_effect">
        <div class="container">
          <p class="intro-text">Hi, I'm</p>
          <p class="name">Wissam Najjom</p>
          <p class="role">Front End Developer</p>

          <div class="button-group">
            <router-link to="/contact" class="btn btn-primary"
              >Contact Me</router-link
            >
            <a
              href="https://github.com/wissam333/Portfolio/raw/gh-pages/CV-New.pdf"
              download="Wissam_CV.pdf"
              class="btn btn-secondary"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </main>

    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <span>Scroll down</span>
      <div class="mouse">
        <div class="wheel"></div>
      </div>
    </div>
  </div>

  <!-- <UiParticleImage image-src="/logo/bluelogo.png" :responsive-width="true" /> -->
</template>

<script setup>
// Generate random properties for more natural stars
const getStarStyle = (index) => {
  const size = Math.random() * 3 + 1;
  const opacity = Math.random() * 0.7 + 0.3;
  const animationDuration = Math.random() * 10 + 3 + "s";
  const animationDelay = Math.random() * 5 + "s";
  const left = Math.random() * 100 + "%";
  const trailLength = Math.floor(Math.random() * 100 + 150) + "px";

  return {
    width: `${size}px`,
    height: `${size}px`,
    opacity: opacity,
    animationDuration: animationDuration,
    animationDelay: animationDelay,
    left: left,
    "--trailLength": trailLength,
  };
};

// If you need reactive data or lifecycle hooks
import { ref, onMounted } from "vue";

const starCount = ref(30);

onMounted(() => {
  // You can add any initialization code here
  console.log("HomePage component mounted");
});
</script>

<style lang="scss" scoped>
$primary-color: #4fc08d;
$text-color: #fff;
$transition-speed: 0.3s;

.home {
  position: relative;
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #0d0d1a, #000);
}

/* Falling Stars Container */
.stars-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;

  span {
    position: absolute;
    top: -20px; // Start above the screen
    width: 2px;
    height: 2px;
    background: #fff;
    border-radius: 50%;
    opacity: 0;
    box-shadow: 0 0 6px #fff, 0 0 12px rgba(255, 255, 255, 0.7);
    animation-name: fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: var(--trailLength, 200px);
      height: 1px;
      background: linear-gradient(
        90deg,
        #fff,
        rgba(255, 255, 255, 0.7),
        transparent
      );
      transform: translateY(-50%) rotate(45deg);
      transform-origin: left center;
      opacity: 0;
      animation: trailFade var(--animationDuration) linear infinite
        var(--animationDelay);
      pointer-events: none;
    }
  }

  @keyframes fall {
    0% {
      transform: translateY(0) translateX(0) rotate(45deg);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(120vh) translateX(-120vw) rotate(45deg);
      opacity: 0;
    }
  }

  @keyframes trailFade {
    0% {
      opacity: 0;
      width: 0;
    }
    10% {
      opacity: 0.9;
    }
    20% {
      opacity: 0.8;
      width: var(--trailLength, 200px);
    }
    80% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      width: var(--trailLength, 200px);
    }
  }
}

/* Content */
.content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: $text-color;
  font-family: "Kdam Thmor Pro", sans-serif;
  padding: 2rem;
}

.intro-text {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.name {
  font-size: 4rem;
  font-weight: bold;
  margin: 1rem 0;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      $primary-color,
      transparent
    );
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.role {
  font-size: 2rem;
  margin-bottom: 2rem;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

/* Buttons */
.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
}

.btn {
  padding: 0.8rem 2rem;
  border: 2px solid $text-color;
  background: transparent;
  color: $text-color;
  font-family: "Kdam Thmor Pro", sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all $transition-speed;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: inline-block;

  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
  }

  &:hover {
    background: $primary-color;
    border-color: $primary-color;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
}

.btn-primary {
  background: rgba($primary-color, 0.2);

  &:hover {
    background: $primary-color;
  }
}

.btn-secondary {
  background: transparent;

  &:hover {
    background: $primary-color;
  }
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: $text-color;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.7;
  animation: fadeIn 2s ease-out 1s both;

  span {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .mouse {
    width: 26px;
    height: 42px;
    border: 2px solid $text-color;
    border-radius: 15px;
    position: relative;

    .wheel {
      width: 3px;
      height: 8px;
      background: $text-color;
      border-radius: 50%;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll 2s infinite;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.7;
  }
}

@keyframes scroll {
  0% {
    opacity: 0;
    transform: translate(-50%, 0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 15px);
  }
}
</style>
