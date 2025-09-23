<template>
  <div class="home">
    <!-- Background -->
    <div class="parallax-container">
      <div class="stars">
        <span v-for="n in 60" :key="n" :style="starStyle(n)" class="star"></span>
      </div>
      <div class="shooting-stars">
        <span v-for="n in 6" :key="'shoot'+n" class="shooting-star"></span>
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

<script>
export default {
  name: "HomePage",
  methods: {
    starStyle(index) {
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const twinkle = Math.random() * 5 + 3 + "s";

      return {
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        top: `${top}%`,
        left: `${left}%`,
        animationDuration: twinkle,
      };
    },
  },
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #0d0d1a, #000);
}

// Parallax background
.parallax-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

// Normal stars
.stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  .star {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    animation: twinkle linear infinite;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

// Shooting stars
.shooting-stars {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  .shooting-star {
    position: absolute;
    top: -10%;
    left: random(100) * 1%;
    width: 2px;
    height: 80px;
    background: linear-gradient(180deg, white, transparent);
    opacity: 0.6;
    transform: rotate(45deg);
    animation: fall 6s linear infinite;
    animation-delay: calc(var(--i, 1) * 1s);
  }

  .shooting-star:nth-child(1) { --i: 0; }
  .shooting-star:nth-child(2) { --i: 2; }
  .shooting-star:nth-child(3) { --i: 4; }
  .shooting-star:nth-child(4) { --i: 6; }
  .shooting-star:nth-child(5) { --i: 8; }
  .shooting-star:nth-child(6) { --i: 10; }
}

@keyframes fall {
  0% {
    transform: translateY(0) translateX(0) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: translateY(150vh) translateX(100vw) rotate(45deg);
    opacity: 0;
  }
}

// Content
.content {
  position: relative;
  z-index: 3;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.type_effect {
  color: $text-color;
  font-family: "Kdam Thmor Pro", sans-serif;
  text-align: center;

  .intro-text {
    font-size: 2rem;
    opacity: 0.8;
  }

  .name {
    font-size: 4rem;
    font-weight: bold;
    margin: 1rem 0;
  }

  .role {
    font-size: 2rem;
    opacity: 0.8;
    margin-bottom: 2rem;
  }
}

// Buttons
.btn {
  padding: 0.8rem 2rem;
  border: 2px solid $text-color;
  background: transparent;
  color: $text-color;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all $transition-speed;
  margin: 0 0.5rem;
  text-decoration: none;

  &:hover {
    background: $primary-color;
    border-color: $primary-color;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  }
}

// Scroll indicator
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: $text-color;
  text-align: center;
  z-index: 4;
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
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(15px); }
}
</style>
