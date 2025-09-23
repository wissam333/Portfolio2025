<template>
  <div class="home">
    <!-- Falling Stars Background -->
    <div class="stars">
      <span v-for="n in 30" :key="n"></span>
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
</template>

<script>
export default {
  name: "HomePage",
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
.stars {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;

  span {
    position: absolute;
    top: -10%;
    right: -10%;
    width: calc(1px + random() * 2px);
    height: 2px;
    background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0));
    opacity: 0.8;
    border-radius: 50%;
    transform: rotate(45deg);
    animation-name: fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  span:nth-child(1) {
    animation-duration: 3s;
    animation-delay: 0s;
    right: 10%;
  }
  span:nth-child(2) {
    animation-duration: 4.5s;
    animation-delay: 0.5s;
    right: 25%;
  }
  span:nth-child(3) {
    animation-duration: 5s;
    animation-delay: 1s;
    right: 40%;
  }
  span:nth-child(4) {
    animation-duration: 3.2s;
    animation-delay: 0.3s;
    right: 55%;
  }
  span:nth-child(5) {
    animation-duration: 4.8s;
    animation-delay: 1.2s;
    right: 70%;
  }
  span:nth-child(6) {
    animation-duration: 5.3s;
    animation-delay: 0.8s;
    right: 85%;
  }
  span:nth-child(7) {
    animation-duration: 4.2s;
    animation-delay: 0.6s;
    right: 20%;
  }
  span:nth-child(8) {
    animation-duration: 6s;
    animation-delay: 1.8s;
    right: 35%;
  }
  span:nth-child(9) {
    animation-duration: 3.5s;
    animation-delay: 2s;
    right: 50%;
  }
  span:nth-child(10) {
    animation-duration: 5.7s;
    animation-delay: 1.5s;
    right: 65%;
  }

  @keyframes fall {
    0% {
      transform: rotate(45deg) translateX(0) translateY(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    100% {
      transform: rotate(45deg) translateX(-1200px) translateY(1200px);
      opacity: 0;
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

/* Buttons */
.btn {
  padding: 0.8rem 2rem;
  border: 2px solid $text-color;
  background: transparent;
  color: $text-color;
  font-size: 1.2rem;
  margin: 0 0.5rem;
  text-decoration: none;
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
