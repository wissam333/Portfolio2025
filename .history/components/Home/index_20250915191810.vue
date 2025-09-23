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
            <router-link to="/contact" class="btn btn-primary">Contact Me</router-link>
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
</template>

<script setup>
import { ref } from "vue";

const starCount = 30;

const getStarStyle = (index) => {
  const size = Math.random() * 2 + 1; // star size
  const duration = Math.random() * 4 + 3 + "s"; // random duration
  const delay = Math.random() * 5 + "s"; // random delay
  const startX = Math.random() * 100 + "%"; // start horizontal position
  const trailLength = Math.floor(Math.random() * 200 + 150) + "px"; // trail length

  return {
    width: size + "px",
    height: size + "px",
    left: startX,
    "--trailLength": trailLength,
    animationDuration: duration,
    animationDelay: delay,
  };
};
</script>

<style lang="scss" scoped>
$primary-color: #69649c;
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

/* Falling Stars */
.stars-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;

  .stars {
    position: absolute;
    width: 100%;
    height: 100%;

    span {
      position: absolute;
      top: -50px; /* start above screen */
      height: 2px;
      background: linear-gradient(
        45deg,
        #fff,
        rgba(255, 255, 255, 0.7),
        transparent
      );
      border-radius: 50%;
      transform: rotate(45deg);
      animation-name: fall;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      width: var(--trailLength, 200px);
    }

    @keyframes fall {
      0% {
        transform: translateY(0) translateX(0) rotate(45deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      80% {
        opacity: 1;
      }
      100% {
        transform: translateY(120vh) translateX(-120vw) rotate(45deg);
        opacity: 0;
      }
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

.name {
  font-size: 4rem;
  font-weight: bold;
  margin: 1rem 0;
}

.role {
  font-size: 2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.8rem 2rem;
  border: 2px solid $text-color;
  background: transparent;
  color: $text-color;
  cursor: pointer;
  transition: all $transition-speed;

  &:hover {
    background: $primary-color;
    border-color: $primary-color;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: $text-color;
  z-index: 2;
  text-align: center;
  opacity: 0.7;

  .mouse {
    width: 26px;
    height: 42px;
    border: 2px solid $text-color;
    border-radius: 15px;
    margin: 0 auto;

    .wheel {
      width: 3px;
      height: 8px;
      background: $text-color;
      border-radius: 50%;
      margin: 6px auto;
      animation: scroll 2s infinite;
    }
  }
}

@keyframes scroll {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(15px);
  }
}
</style>
