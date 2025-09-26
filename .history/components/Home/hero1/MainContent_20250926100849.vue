<template>
  <main class="content" ref="contentContainer">
    <div class="type_effect">
      <div class="container">
        <p class="intro-text" data-aos="fade-up" data-aos-delay="200">
          Hi, I'm
        </p>

        <p class="name" data-aos="fade-up" data-aos-delay="600">
          Wissam Najjom
        </p>

        <p class="role" data-aos="fade-left" data-aos-delay="1000">
          Front End Developer
        </p>

        <div class="button-group">
          <a
            href="#contact"
            class="btn btn-secondary"
            data-aos="flip-right"
            data-aos-delay="1400"
            >Contact Me</a
          >
          <a
            href="https://github.com/wissam333/Portfolio/raw/gh-pages/CV-New.pdf"
            download="Wissam_CV.pdf"
            data-aos="flip-left"
            data-aos-delay="1400"
            class="btn btn-secondary"
          >
            Download CV
          </a>
        </div>
      </div>
    </div>

    <div class="scroll-indicator">
      <span>Scroll down</span>
      <div class="mouse">
        <div class="wheel"></div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";

const contentContainer = ref(null);

onMounted(() => {
  setTimeout(() => {
    document.querySelector(".intro-text")?.classList.add("animate");
  }, 500);
  setTimeout(() => {
    document.querySelector(".name")?.classList.add("animate");
  }, 1500);
  setTimeout(() => {
    document.querySelector(".role")?.classList.add("animate");
  }, 2500);

  setTimeout(() => {
    contentContainer.value?.classList.add("loaded");
  }, 3000);
});

defineExpose({
  $el: contentContainer,
});
</script>

<style lang="scss" scoped>
$text-color: #fff;
$primary-color: #4fc08d;

.content {
  position: relative;
  z-index: 13;
  text-align: center;
  color: $text-color;
  font-family: "Kdam Thmor Pro", sans-serif;
  padding: 2rem;
  margin-bottom: 6rem;
  pointer-events: none;

  @media (max-width: 991px) {
    margin-bottom: 2rem;
  }
}

.intro-text {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.intro-text.animate {
  opacity: 0.9;
  transform: translateY(0);
}

.name {
  font-size: 4rem;
  font-weight: bold;
  margin: 1rem 0;
  position: relative;
  display: inline-block;
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

  @media (max-width: 991px) {
    font-size: 2rem;
  }
}

.name.animate {
  animation: textShine 3s ease-in-out infinite alternate,
    float 6s ease-in-out infinite;
}

@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.role {
  font-size: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 991px) {
    font-size: 1rem;
  }
}

.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  transition: opacity 1s ease 1.5s, transform 1s ease 1.5s;

  @media (max-width: 991px) {
    gap: 0.75rem;
  }
}

.btn {
  pointer-events: all !important;
  padding: 0.8rem 2rem;
  border: 2px solid $text-color;
  background: transparent;
  color: $text-color;
  font-family: "Kdam Thmor Pro", sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: inline-block;

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.6rem;
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

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
}

.btn-secondary {
  background: transparent;
  transition: opacity 1s ease 2.2s, transform 1s ease 2.2s, background 0.3s ease;

  &:hover {
    background: $primary-color;
  }
}

.scroll-indicator {
  position: absolute;
  bottom: -4.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: $text-color;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.7;
  animation: fadeIn 2s ease-out 3s both;

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
