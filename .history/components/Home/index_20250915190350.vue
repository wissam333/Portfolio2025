<template>
  <div class="home">
    <!-- Falling Stars Background -->
    <div class="stars">
      <span v-for="n in 20" :key="n"></span>
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
    top: 0;
    width: 8px;
    height: 2px;
    background: #fff;
    border-radius: 50%;
    opacity: 0.8;
    box-shadow: 0 0 6px #fff, 0 0 12px #fff;
    transform: rotate(315deg);
    animation-name: fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
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

  /* Dynamic animation delays and durations */
  span:nth-child(1) { left: 10%; animation-duration: 4s; animation-delay: 0s; }
  span:nth-child(2) { left: 20%; animation-duration: 5s; animation-delay: 1s; }
  span:nth-child(3) { left: 30%; animation-duration: 6s; animation-delay: 2s; }
  span:nth-child(4) { left: 40%; animation-duration: 3.5s; animation-delay: 0.5s; }
  span:nth-child(5) { left: 50%; animation-duration: 5.5s; animation-delay: 1.2s; }
  span:nth-child(6) { left: 60%; animation-duration: 4.5s; animation-delay: 0.8s; }
  span:nth-child(7) { left: 70%; animation-duration: 6.2s; animation-delay: 1.8s; }
  span:nth-child(8) { left: 80%; animation-duration: 5.2s; animation-delay: 2.3s; }
  span:nth-child(9) { left: 90%; animation-duration: 4.8s; animation-delay: 0.6s; }
  span:nth-child(10){ left: 25%; animation-duration: 5.7s; animation-delay: 1.5s; }
  span:nth-child(11){ left: 35%; animation-duration: 6.5s; animation-delay: 2.0s; }
  span:nth-child(12){ left: 45%; animation-duration: 4.2s; animation-delay: 0.3s; }
  span:nth-child(13){ left: 55%; animation-duration: 5.1s; animation-delay: 1.0s; }
  span:nth-child(14){ left: 65%; animation-duration: 5.9s; animation-delay: 2.5s; }
  span:nth-child(15){ left: 75%; animation-duration: 4.7s; animation-delay: 0.9s; }
  span:nth-child(16){ left: 85%; animation-duration: 5.3s; animation-delay: 1.7s; }
  span:nth-child(17){ left: 15%; animation-duration: 4.5s; animation-delay: 0.2s; }
  span:nth-child(18){ left: 5%;  animation-duration: 6s; animation-delay: 1.4s; }
  span:nth-child(19){ left: 95%; animation-duration: 5.5s; animation-delay: 2.1s; }
  span:nth-child(20){ left: 12%; animation-duration: 4.9s; animation-delay: 0.6s; }

  @keyframes fall {
    0% {
      transform: rotate(315deg) translateX(0) translateY(0);
      opacity: 0;
    }
    30% { opacity: 1; }
    100% {
      transform: rotate(315deg) translateX(-1500px) translateY(1500px);
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

.name { font-size: 4rem; font-weight: bold; margin: 1rem 0; }
.role { font-size: 2rem; margin-bottom: 2rem; opacity: 0.8; }

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
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
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
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(15px); }
}
</style>
