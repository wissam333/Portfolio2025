<template>
  <div
    ref="target"
    class="music-box"
    :class="isVisible ? 'v-show-reveal' : 'v-hide-fade-left'"
  >
    <div class="music-inner">
      <div class="header">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 3v10.55A4 4 0 1014 17V7h4V3z" />
        </svg>
        <span class="title">{{
          $i18n.locale === "ar" ? "التشغيل الآن" : "Now Playing"
        }}</span>
      </div>

      <div class="song-info">
        <span class="name">{{ songName }}</span>
        <button
          name="play-btn"
          class="play-btn"
          @click="handlePlayClick"
          :disabled="isLoading"
        >
          <svg
            v-if="isLoading"
            class="btn-icon loading-spinner"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
              opacity="0.25"
            />
            <path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8z">
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="0.75s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          <svg v-else-if="!isPlaying" class="btn-icon" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="btn-icon" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6zm8-14v14h4V5z" />
          </svg>
        </button>
      </div>

      <div class="progress" v-if="!isLoading">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="progress loading-progress" v-else>
        <div class="bar loading-bar"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { target, isVisible } = useScrollReveal(0.1);

const songUrl = "/savior.mp3";
const songName = "Savior";

const audio = ref(null);
const isPlaying = ref(false);
const isLoading = ref(false);
const progress = ref(0);
const hasLoaded = ref(false);

const handlePlayClick = async () => {
  if (isLoading.value) return;
  if (!hasLoaded.value) await loadAudio();
  if (hasLoaded.value) togglePlay();
};

const loadAudio = () => {
  return new Promise((resolve) => {
    isLoading.value = true;
    audio.value = new Audio(songUrl);

    const onReady = () => {
      hasLoaded.value = true;
      isLoading.value = false;
      resolve();
    };

    audio.value.addEventListener("loadeddata", onReady, { once: true });
    audio.value.addEventListener("canplaythrough", onReady, { once: true });
    audio.value.addEventListener(
      "error",
      () => {
        isLoading.value = false;
        resolve();
      },
      { once: true },
    );

    audio.value.preload = "metadata";
    audio.value.load();
  });
};

const togglePlay = () => {
  if (!audio.value || !hasLoaded.value) return;
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play().catch(console.error);
  }
  isPlaying.value = !isPlaying.value;
};

const updateProgress = () => {
  if (!audio.value?.duration) return;
  progress.value = (audio.value.currentTime / audio.value.duration) * 100;
};

watch(hasLoaded, (loaded) => {
  if (!loaded || !audio.value) return;
  audio.value.addEventListener("timeupdate", updateProgress);
  audio.value.addEventListener("ended", () => {
    isPlaying.value = false;
    progress.value = 0;
  });
  audio.value.addEventListener("pause", () => {
    isPlaying.value = false;
  });
  audio.value.addEventListener("play", () => {
    isPlaying.value = true;
  });
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value.removeEventListener("timeupdate", updateProgress);
    audio.value = null;
  }
});
</script>
