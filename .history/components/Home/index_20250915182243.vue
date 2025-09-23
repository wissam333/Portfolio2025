<template>
  <div class="home">
    <!-- Background elements -->
    <div class="parallax-container">
      <img class="sky" src="/sasa.webp" alt="Sky background" />
      <img class="mountains" src="/sasa2.webp" alt="Mountain silhouette" />
      <div class="overlay"></div>
      <div class="stars">
        <span v-for="n in 20" :key="n" :style="starStyle(n)"></span>
      </div>
    </div>

    <!-- Main content -->
    <main class="content">
      <div class="type_effect">
        <div class="container">
          <p class="intro-text">Hi, I'm</p>
          <p class="glitch" data-glitch="Wissam Najjom,">Wissam Najjom,</p>
          <p class="role">Front End Developer</p>

          <div class="button-group">
            <button class="btn btn-primary">
              <router-link to="/contact">Contact Me</router-link>
            </button>
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
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    this.loaded = true;

    // Add parallax effect on scroll
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector(".parallax-container");
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    },
    starStyle(index) {
      // Generate random properties for more natural stars
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      const animationDuration = Math.random() * 10 + 5 + "s";
      const animationDelay = Math.random() * 5 + "s";

      return {
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        animationDuration: animationDuration,
        animationDelay: animationDelay,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #69649c;
$text-color: #fff;
$glitch-color-1: #f0f;
$glitch-color-2: #0ff;
$transition-speed: 0.3s;

.home {
  position: relative;
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.parallax-container {
  position: absolute;
  width: 100%;
  height: 120%; // Extra height for parallax effect
  top: 0;
  left: 0;
  will-change: transform;

  .mountains {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    object-fit: cover;
    z-index: 2;
  }

  .sky {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    object-fit: cover;
    z-index: 1;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(45deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
    z-index: 3;
  }

  .stars {
    z-index: 1;
  }
}

.content {
  position: relative;
  z-index: 4;
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
  max-width: 1200px;
  width: 100%;

  .container {
    animation: fadeInUp 1s ease-out;
  }

  .intro-text {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  .glitch {
    font-size: 4.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
    position: relative;
    display: inline-block;
    user-select: none;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }

    &:before,
    &:after {
      display: block;
      content: attr(data-glitch);
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      opacity: 0.8;
    }

    &:after {
      color: $glitch-color-1;
      z-index: -2;
    }

    &:before {
      color: $glitch-color-2;
      z-index: -1;
    }

    &:hover {
      &:before {
        animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      }

      &:after {
        animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse
          infinite;
      }
    }
  }

  .role {
    font-size: 2.2rem;
    margin: 1rem 0 2rem;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

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
}

// Button styles
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

  a {
    color: inherit;
    text-decoration: none;
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

// Scroll indicator
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
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

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.7;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-5px, 5px);
  }
  40% {
    transform: translate(-5px, -5px);
  }
  60% {
    transform: translate(5px, 5px);
  }
  80% {
    transform: translate(5px, -5px);
  }
  to {
    transform: translate(0);
  }
}

// Improved stars animation
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  span {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1),
      0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.5);
    animation: twinkle linear infinite;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 300px;
      height: 1px;
      background: linear-gradient(90deg, #fff, transparent);
    }
  }
}

@keyframes twinkle {
  0% {
    opacity: 0;
    transform: translateY(0) rotate(315deg) translateX(0);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) rotate(315deg) translateX(-1000px);
  }
}
</style>
