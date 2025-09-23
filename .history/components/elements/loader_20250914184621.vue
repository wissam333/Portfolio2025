<template>
  <div>
    <ClientOnly>
      <div class="triathlon-loader">
        <div
          id="preloader"
          :class="data.show || useGlobalLoader().value ? 'show' : 'hide'"
        >
          <div id="preloaders" class="loader-content">
            <!-- Logo with pulse animation -->
            <div class="logo-container">
              <NuxtImg
                id="logoLoader"
                src="/photos/logo/logo.png"
                format="webp"
                preload
                class="logo-pulse"
                alt="Logo"
              />
            </div>

            <!-- Triathlon icons with UAE colors -->
            <div class="sport-icons-track">
              <div class="sport-icons">
                <div
                  class="icon-wrapper"
                  v-for="(icon, index) in icons"
                  :key="index"
                >
                  <Icon
                    :name="icon.name"
                    class="sport-icon"
                    :style="{
                      '--delay': `${index * 0.15}s`,
                      '--color': icon.color,
                    }"
                  />
                </div>
              </div>
              <div class="icon-track-line"></div>
            </div>

            <!-- Loading spinner (fallback) -->
            <NuxtImg
              class="Loader"
              width="130"
              preload
              src="/loading/loadingnew.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const props = defineProps({
  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  height: {
    type: Number,
    default: 3,
  },
});

// Triathlon sport icons with UAE flag colors (red, green, white, black)
const icons = [
  { name: "mdi:swim", color: "#ce1126" }, // UAE red
  { name: "mdi:bicycle", color: "#00732f" }, // White
  { name: "mdi:run-fast", color: "#000" }, // UAE green
];

// Options & Data
const data = reactive({
  percent: 0,
  show: true,
  canSucceed: true,
});

// Local variables
let _timer = null;
let _throttle = null;
let _cut;

// Functions (keeping all original logic unchanged)
const clear = () => {
  _timer && clearInterval(_timer);
  _throttle && clearTimeout(_throttle);
  _timer = null;
};
const start = () => {
  clear();
  data.percent = 0;
  data.canSucceed = true;

  if (props.throttle) {
    _throttle = setTimeout(startTimer, props.throttle);
  } else {
    startTimer();
  }
};
const set = (num) => {
  data.show = true;
  data.canSucceed = true;
  data.percent = Math.min(100, Math.max(0, Math.floor(num)));
};
const increase = (num) => {
  data.percent = Math.min(100, Math.floor(data.percent + num));
};
const decrease = (num) => {
  data.percent = Math.max(0, Math.floor(data.percent - num));
};
const pause = () => clearInterval(_timer);
const resume = () => startTimer();
const finish = () => {
  data.percent = 100;
  hide();
};
const hide = () => {
  clear();
  setTimeout(() => {
    data.show = false;
    setTimeout(() => {
      data.percent = 0;
    }, 400);
  }, 500);
};
const startTimer = () => {
  data.show = true;
  _cut = 10000 / Math.floor(props.duration);
  _timer = setInterval(() => {
    increase(_cut);
  }, 100);
};

// Hooks
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:start", start);
nuxtApp.hook("page:finish", finish);

onBeforeUnmount(() => clear);
</script>

<style lang="scss" scoped>
.triathlon-loader {
  #preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 99999;
    background: linear-gradient(135deg, #fff, #fff); // Dark blue background
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.8s cubic-bezier(0.55, 0.09, 0.76, 0.76);
    transform: translateY(-100%);

    &.show {
      transform: translateY(0%);
      transition: none;
      .Loader {
        display: block;
      }
      .sport-icon {
        animation: sportIconEntry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)
          var(--delay) forwards;
      }
    }
    &.hide {
      transform: translateY(-100%);
      .Loader {
        display: none;
      }
      .sport-icon {
        animation: none;
        opacity: 1;
      }
    }
  }

  .loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    width: 100%;
    max-width: 450px;
    padding: 2rem;
  }

  .logo-container {
    position: relative;
    margin-bottom: 1rem;
    padding: 1rem;
  }

  .logo-pulse {
    width: 400px;
    animation: pulse 2s ease-in-out infinite;
    will-change: transform;
    @media (max-width: 991px) {
      width: 250px;
    }
  }

  .sport-icons-track {
    position: relative;
    width: 100%;
    margin: 1.5rem 0;
  }

  .sport-icons {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  .icon-wrapper {
    position: relative;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 52, 149, 0.3); // UAE flag blue
    border-radius: 50%;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .sport-icon {
    font-size: 2.5rem;
    color: var(--color);
    opacity: 0;
    transform-origin: bottom center;
    text-shadow: 0 0 8px rgba(206, 17, 38, 0.6);
  }

  .icon-track-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      #ce1126 20%,
      // UAE red
      #00732f 50%,
      // UAE green
      #000000 80%,
      // White
      transparent 100%
    );
    transform: translateY(-50%);
    z-index: 1;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes sportIconEntry {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.8);
    }
    50% {
      opacity: 1;
      transform: translateY(-10px) scale(1.1);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    .loader-content {
      max-width: 320px;
      gap: 2rem;
      padding: 1.5rem;
    }

    .icon-wrapper {
      width: 50px;
      height: 50px;
    }

    .sport-icon {
      font-size: 2rem;
    }
  }
}
</style>
