<template>
  <div class="home">
    <!-- Background elements -->
    <div class="parallax-container">
      <div class="aurora"></div>
      <div class="stars">
        <span v-for="n in 40" :key="n" :style="starStyle(n)"></span>
      </div>
      <div class="floating-shapes">
        <div v-for="n in 6" :key="'shape'+n" class="shape"></div>
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
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      const animationDuration = Math.random() * 10 + 5 + "s";
      const animationDelay = Math.random() * 5 + "s";

      return {
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        animationDuration,
        animationDelay,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
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
  background: radial-gradient(circle at bottom, #0a0a1f, #000);
}

// Aurora effect
.aurora {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 90deg,
    rgba(0, 255, 150, 0.2),
    rgba(0, 200, 255, 0.3),
    rgba(200, 0, 255, 0.2),
    transparent
  );
  filter: blur(100px);
  animation: auroraMove 20s ease-in-out infinite alternate;
  z-index: 1;
}

@keyframes auroraMove {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(360deg) scale(1.2);
  }
}

// Floating shapes
.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  .shape {
    position: absolute;
    width: 80px;
    height: 80px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 20%;
    animation: float 20s linear infinite;
    top: random(100) * 1%;
    left: random(100) * 1%;
  }

  .shape:nth-child(odd) {
    border-radius: 50%;
  }
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

// Stars
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  span {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    animation: twinkle linear infinite;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
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
    opacity: 0.9;
  }

  .glitch {
    font-size: 4rem;
    font-weight: bold;
    margin: 1rem 0;
    position: relative;
    display: inline-block;

    &:before,
    &:after {
      content: attr(data-glitch);
      position: absolute;
      left: 0;
      width: 100%;
      opacity: 0.8;
    }
    &:before { color: $glitch-color-1; top: -2px; left: 2px; }
    &:after { color: $glitch-color-2; top: 2px; left: -2px; }

    &:hover:before { animation: glitch 0.3s infinite; }
    &:hover:after { animation: glitch 0.3s reverse infinite; }
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
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
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

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-5px, 5px); }
  40% { transform: translate(-5px, -5px); }
  60% { transform: translate(5px, 5px); }
  80% { transform: translate(5px, -5px); }
  100% { transform: translate(0); }
}
</style>
