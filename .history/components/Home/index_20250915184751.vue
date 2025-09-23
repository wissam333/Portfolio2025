<template>
  <div class="home">
    <div class="overlay"></div>
    <img class="sky" src="/sasa.webp" alt="" />
    <img class="mountains" src="/sasa2.webp" alt="" />
    <div class="stars">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="type_effect">
      <div class="container">
        <!--left-->
        <p>Hi, I'm</p>
        <p class="glitch" data-glitch="Wissam Najjom,">Wissam Najjom,</p>
        <p>Front End Developer</p>

        <button class="btn btn-md">
          <router-link to="/contact">Contact Me </router-link>
        </button>
      </div>
    </div>
    <div class="cv">
      <a
        href="https://github.com/wissam333/Portfolio/raw/gh-pages/CV-New.pdf"
        download="Wissam CV"
      >
        <button class="btn btn-md">Download CV</button>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data: function () {
    return {
      loaded: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.stars {
  position: absolute;
  width: 100vw;
  height: 100vh;
  animation: animateBg 50s linear infinite;
  @keyframes animateBg {
    0%,
    100% {
      transform: scale(1.2);
    }
    50% {
      transform: scale(1);
    }
  }
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1),
      0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 1);
    animation: animate 5s linear infinite;
  }
  span::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg, #fff, transparent);
  }
  @keyframes animate {
    0% {
      transform: rotate(315deg) translateX(0);
      opacity: 0;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: rotate(315deg) translateX(-1500px);
      opacity: 0;
    }
  }
  span:nth-child(1) {
    top: 0;
    right: 0;
    left: initial;
    animation-delay: 0;
    animation-duration: 2s;
  }

  span:nth-child(2) {
    top: 0;
    right: 80px;
    left: initial;
    animation-delay: 0.4s;
    animation-duration: 6s;
  }

  span:nth-child(3) {
    top: 80px;
    right: 0px;
    left: initial;
    animation-delay: 0.8s;
    animation-duration: 4s;
  }

  span:nth-child(4) {
    top: 0;
    right: 180px;
    left: initial;
    animation-delay: 1.2s;
    animation-duration: 3s;
  }

  span:nth-child(5) {
    top: 0;
    right: 400px;
    left: initial;
    animation-delay: 1.6s;
    animation-duration: 5s;
  }

  span:nth-child(6) {
    top: 0;
    right: 600px;
    left: initial;
    animation-delay: 2s;
    animation-duration: 6s;
  }
  span:nth-child(7) {
    top: 300px;
    right: 0px;
    left: initial;
    animation-delay: 2s;
    animation-duration: 3.5s;
  }

  span:nth-child(8) {
    top: 0px;
    right: 700px;
    left: initial;
    animation-delay: 2.8s;
    animation-duration: 2.5s;
  }

  span:nth-child(9) {
    top: 0px;
    right: 1000px;
    left: initial;
    animation-delay: 1.5s;
    animation-duration: 4.5s;
  }

  span:nth-child(10) {
    top: 0px;
    right: 1000px;
    left: initial;
    animation-delay: 4.2s;
    animation-duration: 4.5s;
  }
}

.home {
  position: relative;
  overflow: hidden;
  display: flex;
  height: 100vh;
  justify-content: space-between;

  .mountains {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    z-index: 2;
  }

  .sky {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 1;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(6deg, rgb(0 0 0 / 20%), rgb(0 0 0 / 46%));
    z-index: 3;
  }

  .stars {
    z-index: 1;
  }

  .type_effect {
    @keyframes scale {
      100% {
        transform: scale(1);
      }
    }

    color: #fff;
    font-weight: bolder;
    font-family: "Kdam Thmor Pro", sans-serif;
    font-size: 4rem;
    display: flex;
    align-items: center;
    padding: 5vw;
    z-index: 3;

    @media (max-width: 768px) {
      font-size: 8.9vw;
    }

    .glitch {
      user-select: none;
      position: relative;

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
        color: #f0f;
        z-index: -2;
      }

      &:before {
        color: #0ff;
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

    button {
      font-size: 1.2rem;
      border: 2px solid #fff;
      letter-spacing: 1px;

      a {
        text-decoration: none;
        color: #fff;
      }

      @media (max-width: 768px) {
        font-size: 4vw;
      }

      &:hover {
        background-color: #69649c;
      }
    }
  }

  .cv {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9;

    button {
      font-size: 20px;
      color: #fff;
      border: 2px solid #fff;
      letter-spacing: 1px;

      @media (max-width: 768px) {
        font-size: 16px;
      }

      &:hover {
        color: #fff;
        background-color: #69649c;
      }
    }
  }
}
</style>
