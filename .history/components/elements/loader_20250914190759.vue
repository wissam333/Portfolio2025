<template>
  <ClientOnly>
    <div class="frontend-loader">
      <div
        id="preloader"
        :class="data.show || useGlobalLoader().value ? 'show' : 'hide'"
      >
        <div class="loader-content">
          <!-- Logo with pulse animation -->
          <!-- <div class="logo-container">
            <NuxtImg
              src="/photos/logo/logo.png"
              alt="Logo"
              class="logo-pulse"
              width="300"
              preload
            />
          </div> -->

          <!-- Development icons -->
          <div class="dev-icons-track">
            <div class="dev-icons">
              <div
                v-for="(icon, index) in icons"
                :key="index"
                class="icon-wrapper"
                :style="{ '--delay': `${index * 0.2}s`, '--color': icon.color }"
              >
                <Icon :name="icon.name" class="dev-icon" />
              </div>
              <div class="icon-track-line"></div>
            </div>
          </div>

          <!-- Loading Progress -->
          <div class="loading-bar">
            <div class="progress" :style="{ width: data.percent + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const props = defineProps({
  throttle: { type: Number, default: 200 },
  duration: { type: Number, default: 2000 },
});

// Frontend dev icons with color hints
const icons = [
  { name: "mdi:nuxt", label: "Nuxt", color: "#00DC82" }, // Nuxt green
  { name: "mdi:vuejs", label: "Vue.js", color: "#4FC08D" }, // Vue green
  { name: "mdi:nodejs", label: "Node.js", color: "#339933" }, // Node green
  { name: "mdi:database", label: "MongoDB", color: "#47A248" }, // MongoDB green
];

const data = reactive({ percent: 0, show: true });

let _timer = null;
let _throttle = null;
let _cut;

const clear = () => {
  _timer && clearInterval(_timer);
  _throttle && clearTimeout(_throttle);
  _timer = null;
};

const startTimer = () => {
  data.show = true;
  _cut = 10000 / Math.floor(props.duration);
  _timer = setInterval(() => {
    data.percent = Math.min(100, data.percent + _cut);
  }, 100);
};

const start = () => {
  clear();
  data.percent = 0;
  if (props.throttle) _throttle = setTimeout(startTimer, props.throttle);
  else startTimer();
};

const finish = () => {
  data.percent = 100;
  clear();
  setTimeout(() => (data.show = false), 500);
};

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:start", start);
nuxtApp.hook("page:finish", finish);
onBeforeUnmount(clear);
</script>

<style lang="scss" scoped>
.frontend-loader {
  #preloader {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f9f9f9, #ffffff);
    z-index: 9999;
    transition: transform 0.8s cubic-bezier(0.55, 0.09, 0.76, 0.76);
    transform: translateY(-100%);

    &.show {
      transform: translateY(0);
    }
    &.hide {
      transform: translateY(-100%);
    }
  }

  .loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
  }

  .logo-container {
    .logo-pulse {
      width: 300px;
      animation: pulse 2s ease-in-out infinite;
      @media (max-width: 768px) {
        width: 200px;
      }
    }
  }

  .dev-icons-track {
    position: relative;
    width: 100%;
    max-width: 450px;
    margin-bottom: 2rem;
  }

  .dev-icons {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #efefefba;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateY(20px) scale(0.8);
    animation: iconEntry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--delay)
      forwards;
    margin: 0px 20px;
    z-index: 3;
  }

  .dev-icon {
    font-size: 2rem;
    color: var(--color);
  }

  .icon-track-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      #00dc82 20%,
      #4fc08d 40%,
      #339933 60%,
      #47a248 80%
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

  @keyframes iconEntry {
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
    .icon-wrapper {
      width: 50px;
      height: 50px;
    }
    .dev-icon {
      font-size: 1.8rem;
    }
  }
}

/* Loading Bar */
.loading-bar {
  margin: 40px auto 0;
  width: 80%;
  max-width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  .progress {
    height: 100%;
    background: linear-gradient(to right, #4fc08d 0%, #4fc08d 100%);
    border-radius: 2px;
    transition: width 0.1s linear;
  }
}
</style>
